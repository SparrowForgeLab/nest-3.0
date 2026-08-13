const db = require('../models/db');

/**
 * Get all featured/pinned links for the current user
 */
function getFeaturedLinks(req, res) {
    const userId = req.user.id;
    const items = db.prepare('SELECT * FROM featured_links WHERE user_id = ? ORDER BY position ASC').all(userId);
    res.json(items);
}

/**
 * Create a new featured/pinned link or dropdown category folder
 */
function createFeaturedLink(req, res) {
    const userId = req.user.id;
    const { title, url, icon, is_folder, parent_id } = req.body;

    if (!title || (!url && !is_folder)) {
        return res.status(400).json({ error: 'Title and URL (or Folder mode) are required' });
    }

    const maxPosRow = db.prepare('SELECT MAX(position) as maxPos FROM featured_links WHERE user_id = ?').get(userId);
    const maxPos = maxPosRow ? (maxPosRow.maxPos || 0) : 0;

    const cleanTitle = title.trim();
    const cleanUrl = is_folder ? '#' : (url ? url.trim() : '#');
    const cleanIcon = icon ? icon.trim() : (is_folder ? '📁' : '⭐');
    const folderFlag = is_folder ? 1 : 0;
    const parentIdVal = parent_id ? parseInt(parent_id, 10) : null;

    const result = db.prepare(`
        INSERT INTO featured_links (user_id, title, url, icon, position, is_folder, parent_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(userId, cleanTitle, cleanUrl, cleanIcon, maxPos + 1, folderFlag, parentIdVal);

    res.json({ success: true, id: result.lastInsertRowid });
}

/**
 * Update an existing featured/pinned link
 */
function updateFeaturedLink(req, res) {
    const { id } = req.params;
    const { title, url, icon, position, is_folder, parent_id } = req.body;

    db.prepare(`
        UPDATE featured_links
        SET title = COALESCE(?, title),
            url = COALESCE(?, url),
            icon = COALESCE(?, icon),
            position = COALESCE(?, position),
            is_folder = COALESCE(?, is_folder),
            parent_id = ?
        WHERE id = ?
    `).run(
        title ? title.trim() : null,
        url ? url.trim() : null,
        icon ? icon.trim() : null,
        position !== undefined ? position : null,
        is_folder !== undefined ? (is_folder ? 1 : 0) : null,
        parent_id !== undefined ? (parent_id ? parseInt(parent_id, 10) : null) : null,
        id
    );

    res.json({ success: true });
}

/**
 * Delete a featured/pinned link
 */
function deleteFeaturedLink(req, res) {
    const { id } = req.params;
    db.prepare('DELETE FROM featured_links WHERE id = ?').run(id);
    res.json({ success: true });
}

/**
 * Reorder featured/pinned links
 */
function reorderFeaturedLinks(req, res) {
    const { items } = req.body; // Array of { id, position }
    if (!Array.isArray(items)) {
        return res.status(400).json({ error: 'Invalid payload, expected array of items' });
    }

    const stmt = db.prepare('UPDATE featured_links SET position = ? WHERE id = ?');
    const transaction = db.transaction((list) => {
        for (const item of list) {
            stmt.run(item.position, item.id);
        }
    });
    transaction(items);

    res.json({ success: true });
}

module.exports = {
    getFeaturedLinks,
    createFeaturedLink,
    updateFeaturedLink,
    deleteFeaturedLink,
    reorderFeaturedLinks
};
