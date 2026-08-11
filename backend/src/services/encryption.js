const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = process.env.VAULT_SECRET_KEY || 'sparrowforgelab_nest3_vault_secret_key_2026_32bytes!!'; // 32 chars
const KEY = crypto.scryptSync(SECRET_KEY, 'nest3_salt', 32);

/**
 * Encrypt plaintext string using AES-256-GCM
 */
function encrypt(text) {
    if (!text) return '';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypt ciphertext string using AES-256-GCM
 */
function decrypt(encryptedText) {
    if (!encryptedText) return '';
    try {
        const parts = encryptedText.split(':');
        if (parts.length !== 3) return encryptedText;

        const iv = Buffer.from(parts[0], 'hex');
        const authTag = Buffer.from(parts[1], 'hex');
        const encrypted = parts[2];

        const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (err) {
        console.error('Decryption failed:', err.message);
        return '[Encrypted Vault Link]';
    }
}

module.exports = {
    encrypt,
    decrypt
};
