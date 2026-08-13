const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sparrowforgelab_nest3_jwt_secret_2026_super_key';

function authenticateToken(req, res, next) {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
    }
}

function verifyVaultUnlock(req, res, next) {
    const vaultToken = req.cookies?.vault_token || req.headers['x-vault-token'];
    if (vaultToken) {
        try {
            const decoded = jwt.verify(vaultToken, JWT_SECRET);
            if (decoded.unlocked) {
                req.vaultUnlocked = true;
                return next();
            }
        } catch (e) {
            // Invalid vault token
        }
    }
    req.vaultUnlocked = false;
    next();
}

module.exports = {
    JWT_SECRET,
    authenticateToken,
    verifyVaultUnlock
};
