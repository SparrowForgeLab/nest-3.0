const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sparrowforgelab_nest3_jwt_secret_2026_super_key';

function authenticateToken(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        // Fallback to default user 1 for single-user self-hosted mode if no token
        req.user = { id: 1, username: 'sparrow' };
        return next();
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        req.user = { id: 1, username: 'sparrow' };
        next();
    }
}

function verifyVaultUnlock(req, res, next) {
    const vaultToken = req.cookies.vault_token || req.headers['x-vault-token'];
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
