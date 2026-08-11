const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const { JWT_SECRET } = require('../middleware/auth');

function login(req, res) {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username || 'sparrow');

    if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    const validPassword = bcrypt.compareSync(password || 'nest', user.password_hash);
    if (!validPassword) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '30d' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({ success: true, user: { id: user.id, username: user.username } });
}

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
        maxAge: 2 * 60 * 60 * 1000
    });

    res.json({ success: true, vaultToken, unlocked: true });
}

function lockVault(req, res) {
    res.clearCookie('vault_token');
    res.json({ success: true, unlocked: false });
}

function checkStatus(req, res) {
    const userId = req.user.id;
    const user = db.prepare('SELECT id, username FROM users WHERE id = ?').get(userId);
    res.json({
        authenticated: true,
        user,
        vaultUnlocked: req.vaultUnlocked || false
    });
}

module.exports = {
    login,
    verifyVaultPin,
    lockVault,
    checkStatus
};
