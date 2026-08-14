const db = require('../models/db');
const encryption = require('../services/encryption');
const cheerio = require('cheerio');

/**
 * Get all categories and their associated bookmarks
 */
function getDashboardData(req, res) {
    const userId = req.user.id;
    const isVaultUnlocked = req.vaultUnlocked || false;

    if (db.ensureUserDataSeeded) {
        db.ensureUserDataSeeded(userId);
    }

    const categories = db.prepare('SELECT * FROM categories WHERE user_id = ? ORDER BY position ASC').all(userId);
    const bookmarks = db.prepare(`
        SELECT b.*, c.user_id 
        FROM bookmarks b
        JOIN categories c ON b.category_id = c.id
        WHERE c.user_id = ?
        ORDER BY b.position ASC
    `).all(userId);

    const processedBookmarks = bookmarks.map(bm => {
        if (bm.is_vault) {
            if (!isVaultUnlocked) {
                return {
                    id: bm.id,
                    category_id: bm.category_id,
                    title: '🔒 Encrypted Link',
                    url: '#locked',
                    description: 'Unlock Vault to view contents',
                    icon: '🔒',
                    position: bm.position,
                    is_vault: 1,
                    is_featured: bm.is_featured,
                    locked: true
                };
            } else if (bm.encrypted_data) {
                try {
                    const decryptedObj = JSON.parse(bm.encrypted_data);
                    return {
                        ...bm,
                        title: encryption.decrypt(decryptedObj.title) || bm.title,
                        url: encryption.decrypt(decryptedObj.url) || bm.url,
                        description: encryption.decrypt(decryptedObj.description) || bm.description,
                        locked: false
                    };
                } catch (e) {
                    return { ...bm, locked: false };
                }
            }
        }
        return { ...bm, locked: false };
    });

    // Group bookmarks by category
    const categoriesWithBookmarks = categories.map(cat => ({
        ...cat,
        bookmarks: processedBookmarks.filter(b => b.category_id === cat.id)
    }));

    const customFeatured = db.prepare('SELECT id, title, url, icon, position, 0 as is_bookmark, COALESCE(is_folder, 0) as is_folder, parent_id FROM featured_links WHERE user_id = ? ORDER BY position ASC').all(userId);
    const bookmarkFeatured = db.prepare(`
        SELECT b.id, b.title, b.url, b.icon, b.position, 1 as is_bookmark, b.id as bookmark_id, 0 as is_folder, NULL as parent_id
        FROM bookmarks b
        JOIN categories c ON b.category_id = c.id
        WHERE c.user_id = ? AND b.is_featured = 1
        ORDER BY b.position ASC
    `).all(userId);

    const existingUrls = new Set(customFeatured.map(f => f.url));
    const filteredBookmarkFeatured = bookmarkFeatured.filter(b => !existingUrls.has(b.url));
    const featured = [...customFeatured, ...filteredBookmarkFeatured];
    const dailyLeft = db.prepare("SELECT * FROM daily_links WHERE user_id = ? AND side = 'left' ORDER BY position ASC").all(userId);
    const dailyRight = db.prepare("SELECT * FROM daily_links WHERE user_id = ? AND side = 'right' ORDER BY position ASC").all(userId);
    const dock = db.prepare('SELECT * FROM dock_links WHERE user_id = ? ORDER BY position ASC').all(userId);
    const settings = db.prepare('SELECT * FROM settings WHERE user_id = ?').get(userId) || {};

    res.json({
        categories: categoriesWithBookmarks,
        featured,
        daily: { left: dailyLeft, right: dailyRight },
        dock,
        settings,
        vaultUnlocked: isVaultUnlocked
    });
}

/**
 * Category CRUD
 */
function createCategory(req, res) {
    const userId = req.user.id;
    const { name, icon, color, is_vault } = req.body;

    const maxPos = db.prepare('SELECT MAX(position) as maxPos FROM categories WHERE user_id = ?').get(userId).maxPos || 0;

    const result = db.prepare(`
        INSERT INTO categories (user_id, name, icon, color, position, is_vault)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, name || 'New Category', icon || '📁', color || '#3b82f6', maxPos + 1, is_vault ? 1 : 0);

    res.json({ success: true, id: result.lastInsertRowid });
}

function updateCategory(req, res) {
    const { id } = req.params;
    const { name, icon, color, position, is_vault, is_visible } = req.body;

    db.prepare(`
        UPDATE categories 
        SET name = COALESCE(?, name),
            icon = COALESCE(?, icon),
            color = COALESCE(?, color),
            position = COALESCE(?, position),
            is_vault = COALESCE(?, is_vault),
            is_visible = COALESCE(?, is_visible)
        WHERE id = ?
    `).run(
        name !== undefined ? name : null,
        icon !== undefined ? icon : null,
        color !== undefined ? color : null,
        position !== undefined ? position : null,
        is_vault !== undefined ? (is_vault ? 1 : 0) : null,
        is_visible !== undefined ? (is_visible ? 1 : 0) : null,
        id
    );

    res.json({ success: true });
}

function deleteCategory(req, res) {
    const { id } = req.params;
    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    res.json({ success: true });
}

/**
 * Bookmark CRUD
 */
function createBookmark(req, res) {
    const { category_id, title, url, description, icon, is_vault, is_featured, parent_id, is_folder } = req.body;

    const maxPos = db.prepare('SELECT MAX(position) as maxPos FROM bookmarks WHERE category_id = ?').get(category_id).maxPos || 0;

    let encryptedData = null;
    let finalTitle = title;
    let finalUrl = url || '#';
    let finalDesc = description || '';

    if (is_vault) {
        encryptedData = JSON.stringify({
            title: encryption.encrypt(title),
            url: encryption.encrypt(url || '#'),
            description: encryption.encrypt(description || '')
        });
        finalTitle = '🔒 Encrypted Link';
        finalUrl = '#locked';
        finalDesc = 'Encrypted Vault Link';
    }

    const result = db.prepare(`
        INSERT INTO bookmarks (category_id, title, url, description, icon, position, is_vault, encrypted_data, is_featured, parent_id, is_folder)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        category_id,
        finalTitle,
        finalUrl,
        finalDesc,
        icon || (is_folder ? '📁' : ''),
        maxPos + 1,
        is_vault ? 1 : 0,
        encryptedData,
        is_featured ? 1 : 0,
        parent_id || null,
        is_folder ? 1 : 0
    );

    res.json({ success: true, id: result.lastInsertRowid });
}

function updateBookmark(req, res) {
    const { id } = req.params;
    const { category_id, title, url, description, icon, position, is_vault, is_featured, parent_id, is_folder } = req.body;

    let encryptedData = null;
    let finalTitle = title;
    let finalUrl = url;
    let finalDesc = description;

    if (is_vault && title && url) {
        encryptedData = JSON.stringify({
            title: encryption.encrypt(title),
            url: encryption.encrypt(url),
            description: encryption.encrypt(description || '')
        });
        finalTitle = '🔒 Encrypted Link';
        finalUrl = '#locked';
    }

    db.prepare(`
        UPDATE bookmarks
        SET category_id = COALESCE(?, category_id),
            title = COALESCE(?, title),
            url = COALESCE(?, url),
            description = COALESCE(?, description),
            icon = COALESCE(?, icon),
            position = COALESCE(?, position),
            is_vault = COALESCE(?, is_vault),
            encrypted_data = COALESCE(?, encrypted_data),
            is_featured = COALESCE(?, is_featured),
            parent_id = COALESCE(?, parent_id),
            is_folder = COALESCE(?, is_folder)
        WHERE id = ?
    `).run(
        category_id !== undefined ? category_id : null,
        finalTitle !== undefined ? finalTitle : null,
        finalUrl !== undefined ? finalUrl : null,
        finalDesc !== undefined ? finalDesc : null,
        icon !== undefined ? icon : null,
        position !== undefined ? position : null,
        is_vault !== undefined ? (is_vault ? 1 : 0) : null,
        encryptedData !== undefined ? encryptedData : null,
        is_featured !== undefined ? (is_featured ? 1 : 0) : null,
        parent_id !== undefined ? (parent_id ? parent_id : null) : null,
        is_folder !== undefined ? (is_folder ? 1 : 0) : null,
        id
    );

    res.json({ success: true });
}

function deleteBookmark(req, res) {
    const { id } = req.params;
    db.prepare('UPDATE bookmarks SET parent_id = NULL WHERE parent_id = ?').run(id);
    db.prepare('DELETE FROM bookmarks WHERE id = ?').run(id);
    res.json({ success: true });
}

function reorderBookmarks(req, res) {
    const { items } = req.body; // Array of { id, position, category_id, parent_id }
    if (!Array.isArray(items)) return res.status(400).json({ error: 'Invalid payload' });

    const stmt = db.prepare('UPDATE bookmarks SET position = ?, category_id = ?, parent_id = ? WHERE id = ?');
    const transaction = db.transaction((itemList) => {
        for (const item of itemList) {
            stmt.run(item.position, item.category_id, item.parent_id !== undefined ? item.parent_id : null, item.id);
        }
    });

    transaction(items);
    res.json({ success: true });
}

function reorderCategories(req, res) {
    const { items } = req.body; // Array of { id, position }
    if (!Array.isArray(items)) return res.status(400).json({ error: 'Invalid payload' });

    const stmt = db.prepare('UPDATE categories SET position = ? WHERE id = ?');
    const transaction = db.transaction((list) => {
        for (const item of list) {
            stmt.run(item.position, item.id);
        }
    });
    transaction(items);

    res.json({ success: true });
}

/**
 * HTML / JSON Bookmark Import & Export
 */
function importBookmarks(req, res) {
    const userId = req.user.id;
    const { htmlContent, jsonContent } = req.body;

    try {
        if (jsonContent) {
            const data = typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent;
            // Support both Nest 2 & Nest 3 formats
            if (data.categories) {
                data.categories.forEach((cat, idx) => {
                    const catId = db.prepare('INSERT INTO categories (user_id, name, icon, color, position) VALUES (?, ?, ?, ?, ?)').run(userId, cat.name, cat.icon || '📁', cat.color || '#3b82f6', idx).lastInsertRowid;
                    if (cat.bookmarks) {
                        cat.bookmarks.forEach((bm, bmIdx) => {
                            db.prepare('INSERT INTO bookmarks (category_id, title, url, description, icon, position) VALUES (?, ?, ?, ?, ?, ?)').run(catId, bm.title || bm.name, bm.url, bm.description || '', bm.icon || '', bmIdx);
                        });
                    }
                });
            } else if (data.profiles) {
                // Nest 2 format compatibility!
                Object.keys(data.profiles).forEach((pKey, pIdx) => {
                    const prof = data.profiles[pKey];
                    if (prof.columns) {
                        prof.columns.forEach((col, cIdx) => {
                            const catId = db.prepare('INSERT INTO categories (user_id, name, icon, color, position) VALUES (?, ?, ?, ?, ?)').run(userId, `${prof.name}: ${col.name}`, '📁', '#3b82f6', pIdx * 10 + cIdx).lastInsertRowid;
                            if (col.bookmarks) {
                                col.bookmarks.forEach((bm, bIdx) => {
                                    db.prepare('INSERT INTO bookmarks (category_id, title, url, icon, position) VALUES (?, ?, ?, ?, ?)').run(catId, bm.name || bm.title, bm.url, bm.icon || '', bIdx);
                                });
                            }
                        });
                    }
                });
            }
            return res.json({ success: true, message: 'JSON Bookmarks imported successfully' });
        }

        if (htmlContent) {
            const $ = cheerio.load(htmlContent);
            const defaultCatId = db.prepare('INSERT INTO categories (user_id, name, icon, position) VALUES (?, ?, ?, ?)').run(userId, 'Imported Bookmarks', '📥', 99).lastInsertRowid;

            $('a').each((i, el) => {
                const title = $(el).text().trim() || $(el).attr('href');
                const url = $(el).attr('href');
                if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
                    db.prepare('INSERT INTO bookmarks (category_id, title, url, position) VALUES (?, ?, ?, ?)').run(defaultCatId, title, url, i);
                }
            });
            return res.json({ success: true, message: 'HTML Netscape Bookmarks imported successfully' });
        }

        res.status(400).json({ error: 'No valid import data provided' });
    } catch (err) {
        console.error('Import error:', err);
        res.status(500).json({ error: 'Failed to import bookmarks: ' + err.message });
    }
}

function exportBookmarks(req, res) {
    const userId = req.user.id;
    const categories = db.prepare('SELECT * FROM categories WHERE user_id = ? ORDER BY position ASC').all(userId);
    const bookmarks = db.prepare(`
        SELECT b.* 
        FROM bookmarks b
        JOIN categories c ON b.category_id = c.id
        WHERE c.user_id = ?
        ORDER BY b.position ASC
    `).all(userId);

    const exportData = {
        version: '3.0.0',
        exportedAt: new Date().toISOString(),
        categories: categories.map(cat => ({
            name: cat.name,
            icon: cat.icon,
            color: cat.color,
            bookmarks: bookmarks.filter(b => b.category_id === cat.id).map(b => ({
                title: b.title,
                url: b.url,
                description: b.description,
                icon: b.icon
            }))
        }))
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=nest3-backup.json');
    res.send(JSON.stringify(exportData, null, 2));
}

module.exports = {
    getDashboardData,
    createCategory,
    updateCategory,
    deleteCategory,
    createBookmark,
    updateBookmark,
    deleteBookmark,
    reorderBookmarks,
    reorderCategories,
    importBookmarks,
    exportBookmarks
};
