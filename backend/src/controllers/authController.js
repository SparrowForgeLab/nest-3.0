const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const { JWT_SECRET } = require('../middleware/auth');

/**
 * User Login
 */
function login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username.trim());

    if (!user) {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const validPassword = bcrypt.compareSync(password, user.password_hash);
    if (!validPassword) {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '30d' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({
        success: true,
        token,
        user: { id: user.id, username: user.username }
    });
}

/**
 * User Registration & Provisioning
 */
function register(req, res) {
    const { username, password } = req.body;

    if (!username || !username.trim() || username.trim().length < 3) {
        return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
    }

    if (!password || password.length < 4) {
        return res.status(400).json({ error: 'Password must be at least 4 characters long.' });
    }

    const cleanUsername = username.trim();

    // Check if user already exists
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(cleanUsername);
    if (existing) {
        return res.status(400).json({ error: 'Username is already taken. Please choose another or sign in.' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const result = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(cleanUsername, passwordHash);
    const userId = result.lastInsertRowid;

    // Initialize user default settings
    db.prepare('INSERT INTO settings (user_id) VALUES (?)').run(userId);

    // Seed default starter categories and bookmarks for new user
    const cat1 = db.prepare('INSERT INTO categories (user_id, name, icon, color, position) VALUES (?, ?, ?, ?, ?)').run(userId, 'General & Search', '🔍', '#38bdf8', 0).lastInsertRowid;
    const cat2 = db.prepare('INSERT INTO categories (user_id, name, icon, color, position) VALUES (?, ?, ?, ?, ?)').run(userId, 'Developer Tools', '⚡', '#a855f7', 1).lastInsertRowid;
    const cat3 = db.prepare('INSERT INTO categories (user_id, name, icon, color, position) VALUES (?, ?, ?, ?, ?)').run(userId, 'Media & Social', '🍿', '#ec4899', 2).lastInsertRowid;

    db.prepare('INSERT INTO bookmarks (category_id, title, url, description, icon, position) VALUES (?, ?, ?, ?, ?, ?)').run(cat1, 'Google Search', 'https://google.com', 'Search the web', '🔍', 0);
    db.prepare('INSERT INTO bookmarks (category_id, title, url, description, icon, position) VALUES (?, ?, ?, ?, ?, ?)').run(cat1, 'DuckDuckGo', 'https://duckduckgo.com', 'Privacy search engine', '🦆', 1);
    db.prepare('INSERT INTO bookmarks (category_id, title, url, description, icon, position) VALUES (?, ?, ?, ?, ?, ?)').run(cat2, 'GitHub', 'https://github.com', 'Code repository hosting', '🐙', 0);
    db.prepare('INSERT INTO bookmarks (category_id, title, url, description, icon, position) VALUES (?, ?, ?, ?, ?, ?)').run(cat2, 'ChatGPT', 'https://chatgpt.com', 'AI Assistant', '🤖', 1);
    db.prepare('INSERT INTO bookmarks (category_id, title, url, description, icon, position) VALUES (?, ?, ?, ?, ?, ?)').run(cat3, 'YouTube', 'https://youtube.com', 'Videos & Music', '📺', 0);

    // Seed default featured links
    db.prepare('INSERT INTO featured_links (user_id, title, url, icon, position) VALUES (?, ?, ?, ?, ?)').run(userId, 'SparrowForge Lab', 'https://sparrowforgelab.com', '🪶', 0);
    db.prepare('INSERT INTO featured_links (user_id, title, url, icon, position) VALUES (?, ?, ?, ?, ?)').run(userId, 'ChatGPT', 'https://chatgpt.com', '🤖', 1);

    // Seed default dock links
    db.prepare('INSERT INTO dock_links (user_id, name, url, icon, position) VALUES (?, ?, ?, ?, ?)').run(userId, 'SparrowForge', 'https://sparrowforgelab.com', '🪶', 0);
    db.prepare('INSERT INTO dock_links (user_id, name, url, icon, position) VALUES (?, ?, ?, ?, ?)').run(userId, 'GitHub', 'https://github.com', '🐙', 1);
    db.prepare('INSERT INTO dock_links (user_id, name, url, icon, position) VALUES (?, ?, ?, ?, ?)').run(userId, 'ChatGPT', 'https://chatgpt.com', '🤖', 2);
    db.prepare('INSERT INTO dock_links (user_id, name, url, icon, position) VALUES (?, ?, ?, ?, ?)').run(userId, 'YouTube', 'https://youtube.com', '📺', 3);

    const token = jwt.sign({ id: userId, username: cleanUsername }, JWT_SECRET, { expiresIn: '30d' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({
        success: true,
        token,
        user: { id: userId, username: cleanUsername }
    });
}

/**
 * User Logout
 */
function logout(req, res) {
    res.clearCookie('token');
    res.clearCookie('vault_token');
    res.json({ success: true, message: 'Logged out successfully.' });
}

/**
 * Verify Vault PIN / Password
 */
function verifyVaultPin(req, res) {
    const { pin } = req.body;
    const userId = req.user.id;
    const user = db.prepare('SELECT vault_pin_hash, password_hash FROM users WHERE id = ?').get(userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    let isValid = false;
    if (user.vault_pin_hash) {
        isValid = bcrypt.compareSync(pin, user.vault_pin_hash);
    }
    if (!isValid && user.password_hash) {
        isValid = bcrypt.compareSync(pin, user.password_hash);
    }

    if (!isValid) {
        return res.status(401).json({ error: 'Invalid Vault PIN / Password' });
    }

    const vaultToken = jwt.sign({ userId, unlocked: true }, JWT_SECRET, { expiresIn: '2h' });

    res.cookie('vault_token', vaultToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 2 * 60 * 60 * 1000
    });

    res.json({ success: true, vaultToken, unlocked: true });
}

/**
 * Lock Private Vault
 */
function lockVault(req, res) {
    res.clearCookie('vault_token');
    res.json({ success: true, unlocked: false });
}

/**
 * Check Authentication Status
 */
function checkStatus(req, res) {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.json({ authenticated: false, user: null, vaultUnlocked: false });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = db.prepare('SELECT id, username FROM users WHERE id = ?').get(decoded.id);
        if (!user) {
            return res.json({ authenticated: false, user: null, vaultUnlocked: false });
        }

        return res.json({
            authenticated: true,
            user,
            vaultUnlocked: req.vaultUnlocked || false
        });
    } catch (e) {
        return res.json({ authenticated: false, user: null, vaultUnlocked: false });
    }
}

module.exports = {
    login,
    register,
    logout,
    changePassword,
    verifyVaultPin,
    lockVault,
    checkStatus
};

/**
 * Change User Password (Requires old password verification)
 */
function changePassword(req, res) {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Both current password and new password are required.' });
    }

    if (newPassword.length < 4) {
        return res.status(400).json({ error: 'New password must be at least 4 characters long.' });
    }

    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(userId);
    if (!user) {
        return res.status(404).json({ error: 'User account not found.' });
    }

    const validOldPassword = bcrypt.compareSync(oldPassword, user.password_hash);
    if (!validOldPassword) {
        return res.status(401).json({ error: 'Incorrect current password.' });
    }

    const newPasswordHash = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newPasswordHash, userId);

    res.json({ success: true, message: 'Password updated successfully!' });
}
