const db = require('../models/db');

/**
 * Get all dock links for current user
 */
function getDockLinks(req, res) {
    const userId = req.user.id;
    const items = db.prepare('SELECT * FROM dock_links WHERE user_id = ? ORDER BY position ASC').all(userId);
    res.json(items);
}

/**
 * Create a new dock link
 */
function createDockLink(req, res) {
    const userId = req.user.id;
    const { name, url, icon } = req.body;

    if (!name || !url) {
        return res.status(400).json({ error: 'Name and URL are required' });
    }

    const maxPosRow = db.prepare('SELECT MAX(position) as maxPos FROM dock_links WHERE user_id = ?').get(userId);
    const maxPos = maxPosRow ? (maxPosRow.maxPos || 0) : 0;

    const result = db.prepare(`
        INSERT INTO dock_links (user_id, name, url, icon, position)
        VALUES (?, ?, ?, ?, ?)
    `).run(userId, name.trim(), url.trim(), icon ? icon.trim() : '📱', maxPos + 1);

    res.json({ success: true, id: result.lastInsertRowid });
}

/**
 * Update an existing dock link
 */
function updateDockLink(req, res) {
    const { id } = req.params;
    const { name, url, icon, position } = req.body;

    db.prepare(`
        UPDATE dock_links
        SET name = COALESCE(?, name),
            url = COALESCE(?, url),
            icon = COALESCE(?, icon),
            position = COALESCE(?, position)
        WHERE id = ?
    `).run(
        name ? name.trim() : null,
        url ? url.trim() : null,
        icon ? icon.trim() : null,
        position !== undefined ? position : null,
        id
    );

    res.json({ success: true });
}

/**
 * Delete a dock link
 */
function deleteDockLink(req, res) {
    const { id } = req.params;
    db.prepare('DELETE FROM dock_links WHERE id = ?').run(id);
    res.json({ success: true });
}

/**
 * Reorder dock links
 */
function reorderDockLinks(req, res) {
    const { items } = req.body; // Array of { id, position }
    if (!Array.isArray(items)) {
        return res.status(400).json({ error: 'Invalid payload, expected array of items' });
    }

    const stmt = db.prepare('UPDATE dock_links SET position = ? WHERE id = ?');
    const transaction = db.transaction((list) => {
        for (const item of list) {
            stmt.run(item.position, item.id);
        }
    });
    transaction(items);

    res.json({ success: true });
}

/**
 * Toggle bookmark pinning to dock
 */
function toggleBookmarkDock(req, res) {
    const userId = req.user.id;
    const { title, name, url, icon } = req.body;
    const linkUrl = url ? url.trim() : '';
    const linkName = (title || name || 'Link').trim();

    if (!linkUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const existing = db.prepare('SELECT id FROM dock_links WHERE user_id = ? AND url = ?').get(userId, linkUrl);

    if (existing) {
        // Unpin from dock
        db.prepare('DELETE FROM dock_links WHERE id = ?').run(existing.id);
        res.json({ success: true, docked: false, message: 'Unpinned from dock' });
    } else {
        // Pin to dock
        const maxPosRow = db.prepare('SELECT MAX(position) as maxPos FROM dock_links WHERE user_id = ?').get(userId);
        const maxPos = maxPosRow ? (maxPosRow.maxPos || 0) : 0;

        const result = db.prepare(`
            INSERT INTO dock_links (user_id, name, url, icon, position)
            VALUES (?, ?, ?, ?, ?)
        `).run(userId, linkName, linkUrl, icon ? icon.trim() : '📱', maxPos + 1);

        res.json({ success: true, docked: true, id: result.lastInsertRowid, message: 'Pinned to dock' });
    }
}

module.exports = {
    getDockLinks,
    createDockLink,
    updateDockLink,
    deleteDockLink,
    reorderDockLinks,
    toggleBookmarkDock
};
