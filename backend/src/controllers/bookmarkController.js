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
 * Full Dashboard Import & Export (Settings, Categories, Bookmarks, Featured Links, Dock, Widgets, RSS, Todos)
 */
function importBookmarks(req, res) {
    const userId = req.user.id;
    const { htmlContent, jsonContent, overwrite = true } = req.body;

    try {
        if (jsonContent) {
            const data = typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent;

            // 1. Import Settings if available
            if (data.settings && typeof data.settings === 'object') {
                const s = data.settings;
                const updateQuery = `
                    UPDATE settings SET
                        theme = COALESCE(?, theme),
                        search_engine = COALESCE(?, search_engine),
                        column_count = COALESCE(?, column_count),
                        font_size = COALESCE(?, font_size),
                        layout_style = COALESCE(?, layout_style),
                        view_mode = COALESCE(?, view_mode),
                        show_header = COALESCE(?, show_header),
                        show_daily = COALESCE(?, show_daily),
                        show_dock = COALESCE(?, show_dock),
                        show_clock = COALESCE(?, show_clock),
                        show_weather = COALESCE(?, show_weather),
                        show_rss = COALESCE(?, show_rss),
                        show_todo = COALESCE(?, show_todo),
                        show_calendar = COALESCE(?, show_calendar),
                        clock_type = COALESCE(?, clock_type),
                        clock_format = COALESCE(?, clock_format),
                        rss_position = COALESCE(?, rss_position),
                        todo_position = COALESCE(?, todo_position),
                        background_image = COALESCE(?, background_image),
                        background_blur = COALESCE(?, background_blur),
                        background_dim = COALESCE(?, background_dim),
                        weather_location = COALESCE(?, weather_location),
                        weather_lat = COALESCE(?, weather_lat),
                        weather_lon = COALESCE(?, weather_lon),
                        weather_units = COALESCE(?, weather_units),
                        weather_size = COALESCE(?, weather_size),
                        weather_layout = COALESCE(?, weather_layout),
                        weather_display_size = COALESCE(?, weather_display_size),
                        show_featured = COALESCE(?, show_featured),
                        weather_position = COALESCE(?, weather_position),
                        clock_position = COALESCE(?, clock_position),
                        left_sidebar_open = COALESCE(?, left_sidebar_open),
                        right_sidebar_open = COALESCE(?, right_sidebar_open),
                        user_name = COALESCE(?, user_name)
                    WHERE user_id = ?
                `;
                db.prepare(updateQuery).run(
                    s.theme || null, s.search_engine || null, s.column_count || null, s.font_size || null, s.layout_style || null, s.view_mode || null,
                    s.show_header !== undefined ? s.show_header : null, s.show_daily !== undefined ? s.show_daily : null, s.show_dock !== undefined ? s.show_dock : null, s.show_clock !== undefined ? s.show_clock : null, s.show_weather !== undefined ? s.show_weather : null, s.show_rss !== undefined ? s.show_rss : null, s.show_todo !== undefined ? s.show_todo : null, s.show_calendar !== undefined ? s.show_calendar : null,
                    s.clock_type || null, s.clock_format || null, s.rss_position || null, s.todo_position || null, s.background_image !== undefined ? s.background_image : null, s.background_blur !== undefined ? s.background_blur : null, s.background_dim !== undefined ? s.background_dim : null,
                    s.weather_location || null, s.weather_lat || null, s.weather_lon || null, s.weather_units || null, s.weather_size || null, s.weather_layout || null, s.weather_display_size || null,
                    s.show_featured !== undefined ? s.show_featured : null, s.weather_position || null, s.clock_position || null, s.left_sidebar_open !== undefined ? s.left_sidebar_open : null, s.right_sidebar_open !== undefined ? s.right_sidebar_open : null, s.user_name || null,
                    userId
                );
            }

            // If overwrite mode is true and we have categories/bookmarks, replace existing ones cleanly
            if (overwrite && (data.categories || data.profiles)) {
                db.prepare('DELETE FROM bookmarks WHERE category_id IN (SELECT id FROM categories WHERE user_id = ?)').run(userId);
                db.prepare('DELETE FROM categories WHERE user_id = ?').run(userId);
            }

            // 2. Import Categories & Bookmarks (Nest 3 format)
            if (data.categories && Array.isArray(data.categories)) {
                data.categories.forEach((cat, idx) => {
                    const catId = db.prepare(`
                        INSERT INTO categories (user_id, name, icon, color, position, is_vault, is_visible)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    `).run(
                        userId,
                        cat.name || 'Category',
                        cat.icon || '📁',
                        cat.color || '#3b82f6',
                        cat.position !== undefined ? cat.position : idx,
                        cat.is_vault ? 1 : 0,
                        cat.is_visible !== undefined ? (cat.is_visible ? 1 : 0) : 1
                    ).lastInsertRowid;

                    if (cat.bookmarks && Array.isArray(cat.bookmarks)) {
                        cat.bookmarks.forEach((bm, bmIdx) => {
                            db.prepare(`
                                INSERT INTO bookmarks (category_id, title, url, description, icon, position, is_vault, parent_id, is_folder)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                            `).run(
                                catId,
                                bm.title || bm.name || 'Untitled',
                                bm.url || '#',
                                bm.description || '',
                                bm.icon || '',
                                bm.position !== undefined ? bm.position : bmIdx,
                                bm.is_vault ? 1 : 0,
                                bm.parent_id || null,
                                bm.is_folder ? 1 : 0
                            );
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

            // 3. Import Featured Links if present
            if (data.featured_links && Array.isArray(data.featured_links)) {
                if (overwrite) db.prepare('DELETE FROM featured_links WHERE user_id = ?').run(userId);
                data.featured_links.forEach((fl, idx) => {
                    db.prepare('INSERT INTO featured_links (user_id, title, url, icon, position) VALUES (?, ?, ?, ?, ?)').run(
                        userId, fl.title || fl.name, fl.url, fl.icon || '⭐', fl.position !== undefined ? fl.position : idx
                    );
                });
            } else if (data.featured && Array.isArray(data.featured)) {
                if (overwrite) db.prepare('DELETE FROM featured_links WHERE user_id = ?').run(userId);
                data.featured.forEach((fl, idx) => {
                    db.prepare('INSERT INTO featured_links (user_id, title, url, icon, position) VALUES (?, ?, ?, ?, ?)').run(
                        userId, fl.title || fl.name, fl.url, fl.icon || '⭐', fl.position !== undefined ? fl.position : idx
                    );
                });
            }

            // 4. Import Dock Links if present
            if (data.dock_links && Array.isArray(data.dock_links)) {
                if (overwrite) db.prepare('DELETE FROM dock_links WHERE user_id = ?').run(userId);
                data.dock_links.forEach((dl, idx) => {
                    db.prepare('INSERT INTO dock_links (user_id, name, url, icon, position) VALUES (?, ?, ?, ?, ?)').run(
                        userId, dl.name || dl.title, dl.url, dl.icon || '📱', dl.position !== undefined ? dl.position : idx
                    );
                });
            } else if (data.dock && Array.isArray(data.dock)) {
                if (overwrite) db.prepare('DELETE FROM dock_links WHERE user_id = ?').run(userId);
                data.dock.forEach((dl, idx) => {
                    db.prepare('INSERT INTO dock_links (user_id, name, url, icon, position) VALUES (?, ?, ?, ?, ?)').run(
                        userId, dl.name || dl.title, dl.url, dl.icon || '📱', dl.position !== undefined ? dl.position : idx
                    );
                });
            }

            // 5. Import Daily Links if present
            if (data.daily_links && Array.isArray(data.daily_links)) {
                if (overwrite) db.prepare('DELETE FROM daily_links WHERE user_id = ?').run(userId);
                data.daily_links.forEach((dl, idx) => {
                    db.prepare('INSERT INTO daily_links (user_id, name, url, icon, side, position) VALUES (?, ?, ?, ?, ?, ?)').run(
                        userId, dl.name || dl.title, dl.url, dl.icon || '🔗', dl.side || 'left', dl.position !== undefined ? dl.position : idx
                    );
                });
            }

            // 6. Import Todos if present
            if (data.todos && Array.isArray(data.todos)) {
                if (overwrite) db.prepare('DELETE FROM todos WHERE user_id = ?').run(userId);
                data.todos.forEach((td, idx) => {
                    db.prepare('INSERT INTO todos (user_id, text, completed, position) VALUES (?, ?, ?, ?)').run(
                        userId, td.text, td.completed ? 1 : 0, td.position !== undefined ? td.position : idx
                    );
                });
            }

            // 7. Import RSS feeds if present
            if (data.rss_feeds && Array.isArray(data.rss_feeds)) {
                if (overwrite) db.prepare('DELETE FROM rss_feeds WHERE user_id = ?').run(userId);
                data.rss_feeds.forEach((rf) => {
                    db.prepare('INSERT INTO rss_feeds (user_id, title, url, category) VALUES (?, ?, ?, ?)').run(
                        userId, rf.title, rf.url, rf.category || 'General'
                    );
                });
            }

            return res.json({ success: true, message: 'Full Nest 3.0 backup restored successfully!' });
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
        res.status(500).json({ error: 'Failed to import backup: ' + err.message });
    }
}

function exportBookmarks(req, res) {
    const userId = req.user.id;
    const settings = db.prepare('SELECT * FROM settings WHERE user_id = ?').get(userId) || {};
    const categories = db.prepare('SELECT * FROM categories WHERE user_id = ? ORDER BY position ASC').all(userId);
    const bookmarks = db.prepare(`
        SELECT b.* 
        FROM bookmarks b
        JOIN categories c ON b.category_id = c.id
        WHERE c.user_id = ?
        ORDER BY b.position ASC
    `).all(userId);

    const featured_links = db.prepare('SELECT * FROM featured_links WHERE user_id = ? ORDER BY position ASC').all(userId);
    const dock_links = db.prepare('SELECT * FROM dock_links WHERE user_id = ? ORDER BY position ASC').all(userId);
    const daily_links = db.prepare('SELECT * FROM daily_links WHERE user_id = ? ORDER BY position ASC').all(userId);
    const todos = db.prepare('SELECT * FROM todos WHERE user_id = ? ORDER BY position ASC').all(userId);
    const rss_feeds = db.prepare('SELECT * FROM rss_feeds WHERE user_id = ?').all(userId);
    const calendar_feeds = db.prepare('SELECT * FROM calendar_feeds WHERE user_id = ?').all(userId);

    const user = db.prepare('SELECT username FROM users WHERE id = ?').get(userId);

    const exportData = {
        version: '3.0.0',
        exportedAt: new Date().toISOString(),
        user: { username: user ? user.username : 'sparrow' },
        settings,
        categories: categories.map(cat => ({
            name: cat.name,
            icon: cat.icon,
            color: cat.color,
            position: cat.position,
            is_vault: cat.is_vault,
            is_visible: cat.is_visible,
            bookmarks: bookmarks.filter(b => b.category_id === cat.id).map(b => ({
                title: b.title,
                url: b.url,
                description: b.description,
                icon: b.icon,
                position: b.position,
                is_vault: b.is_vault,
                is_folder: b.is_folder,
                parent_id: b.parent_id
            }))
        })),
        featured_links: featured_links.map(f => ({ title: f.title, url: f.url, icon: f.icon, position: f.position })),
        dock_links: dock_links.map(d => ({ name: d.name, url: d.url, icon: d.icon, position: d.position })),
        daily_links: daily_links.map(dl => ({ name: dl.name, url: dl.url, icon: dl.icon, side: dl.side, position: dl.position })),
        todos: todos.map(t => ({ text: t.text, completed: t.completed, position: t.position })),
        rss_feeds: rss_feeds.map(r => ({ title: r.title, url: r.url, category: r.category })),
        calendar_feeds: calendar_feeds.map(c => ({ title: c.title, url: c.url, color: c.color }))
    };

    const filename = `nest3-full-backup-${new Date().toISOString().slice(0, 10)}.json`;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
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
