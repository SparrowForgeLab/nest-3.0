const fs = require('fs');
const path = require('path');

let selfhstIcons = [];
let techIcons = [];

// Load cached JSON icon indexes
try {
    const selfhstPath = path.join(__dirname, '../data/selfhst_icons.json');
    if (fs.existsSync(selfhstPath)) {
        selfhstIcons = JSON.parse(fs.readFileSync(selfhstPath, 'utf8'));
    }
} catch (e) {
    console.error('Failed to load selfhst_icons.json:', e.message);
}

try {
    const techPath = path.join(__dirname, '../data/tech_icons.json');
    if (fs.existsSync(techPath)) {
        techIcons = JSON.parse(fs.readFileSync(techPath, 'utf8'));
    }
} catch (e) {
    console.error('Failed to load tech_icons.json:', e.message);
}

function getSelfhstIcons(req, res) {
    const { search = '', limit = 60, page = 1 } = req.query;
    const query = search.toLowerCase().trim();

    let filtered = selfhstIcons;
    if (query) {
        filtered = selfhstIcons.filter(i => 
            i.name.toLowerCase().includes(query) || i.slug.toLowerCase().includes(query)
        );
    }

    const pageSize = Math.min(parseInt(limit) || 60, 200);
    const currentPage = Math.max(parseInt(page) || 1, 1);
    const startIndex = (currentPage - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);

    res.json({
        success: true,
        total: filtered.length,
        page: currentPage,
        totalPages: Math.ceil(filtered.length / pageSize),
        icons: paginated
    });
}

function getTechIcons(req, res) {
    const { search = '', limit = 60, page = 1 } = req.query;
    const query = search.toLowerCase().trim();

    let filtered = techIcons;
    if (query) {
        filtered = techIcons.filter(i => 
            i.name.toLowerCase().includes(query) || i.slug.toLowerCase().includes(query)
        );
    }

    const pageSize = Math.min(parseInt(limit) || 60, 200);
    const currentPage = Math.max(parseInt(page) || 1, 1);
    const startIndex = (currentPage - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);

    res.json({
        success: true,
        total: filtered.length,
        page: currentPage,
        totalPages: Math.ceil(filtered.length / pageSize),
        icons: paginated
    });
}

module.exports = {
    getSelfhstIcons,
    getTechIcons
};
