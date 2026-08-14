const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/nest3.db');
const dataDir = path.dirname(dbPath);

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

function initDb() {
    // 1. Users table
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            vault_pin_hash TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // 2. Categories table
    db.exec(`
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            icon TEXT DEFAULT '📁',
            color TEXT DEFAULT '#3b82f6',
            position INTEGER DEFAULT 0,
            is_vault INTEGER DEFAULT 0,
            is_visible INTEGER DEFAULT 1,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    // 3. Bookmarks table
    db.exec(`
        CREATE TABLE IF NOT EXISTS bookmarks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            url TEXT NOT NULL,
            description TEXT DEFAULT '',
            icon TEXT DEFAULT '',
            position INTEGER DEFAULT 0,
            is_vault INTEGER DEFAULT 0,
            encrypted_data TEXT,
            is_featured INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        );
    `);

    // 4. Featured links table
    db.exec(`
        CREATE TABLE IF NOT EXISTS featured_links (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            url TEXT NOT NULL,
            icon TEXT DEFAULT '⭐',
            position INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    // 5. Daily quick links table
    db.exec(`
        CREATE TABLE IF NOT EXISTS daily_links (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            url TEXT NOT NULL,
            icon TEXT DEFAULT '🔗',
            side TEXT CHECK(side IN ('left', 'right')) NOT NULL,
            position INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    // 6. Dock links table
    db.exec(`
        CREATE TABLE IF NOT EXISTS dock_links (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            url TEXT NOT NULL,
            icon TEXT DEFAULT '📱',
            position INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    // 7. To-Do tasks table
    db.exec(`
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            text TEXT NOT NULL,
            completed INTEGER DEFAULT 0,
            position INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    // 8. RSS Feeds table
    db.exec(`
        CREATE TABLE IF NOT EXISTS rss_feeds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            url TEXT NOT NULL,
            category TEXT DEFAULT 'General',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    // 9. Calendar ICS Feeds table
    db.exec(`
        CREATE TABLE IF NOT EXISTS calendar_feeds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            url TEXT NOT NULL,
            color TEXT DEFAULT '#3b82f6',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    // 10. User Settings table
    db.exec(`
        CREATE TABLE IF NOT EXISTS settings (
            user_id INTEGER PRIMARY KEY,
            theme TEXT DEFAULT 'sparrow-dark',
            search_engine TEXT DEFAULT 'google',
            column_count INTEGER DEFAULT 4,
            font_size INTEGER DEFAULT 16,
            layout_style TEXT DEFAULT 'normal',
            view_mode TEXT DEFAULT 'grid',
            show_header INTEGER DEFAULT 1,
            show_featured INTEGER DEFAULT 1,
            show_daily INTEGER DEFAULT 1,
            show_dock INTEGER DEFAULT 1,
            show_clock INTEGER DEFAULT 1,
            show_weather INTEGER DEFAULT 1,
            show_rss INTEGER DEFAULT 0,
            show_todo INTEGER DEFAULT 1,
            show_calendar INTEGER DEFAULT 0,
            clock_type TEXT DEFAULT 'digital',
            clock_format TEXT DEFAULT '12h',
            rss_position TEXT DEFAULT 'grid',
            todo_position TEXT DEFAULT 'grid',
            background_image TEXT DEFAULT '',
            background_blur INTEGER DEFAULT 16,
            background_dim INTEGER DEFAULT 40,
            weather_location TEXT DEFAULT 'London, UK',
            weather_lat REAL DEFAULT 51.5074,
            weather_lon REAL DEFAULT -0.1278,
            weather_units TEXT DEFAULT 'celsius',
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    // Idempotent column migrations for existing database schemas
    const migrations = [
        { table: 'settings', column: 'show_header', type: 'INTEGER DEFAULT 1' },
        { table: 'settings', column: 'show_featured', type: 'INTEGER DEFAULT 1' },
        { table: 'settings', column: 'clock_type', type: 'TEXT DEFAULT "digital"' },
        { table: 'settings', column: 'clock_format', type: 'TEXT DEFAULT "12h"' },
        { table: 'settings', column: 'rss_position', type: 'TEXT DEFAULT "grid"' },
        { table: 'settings', column: 'todo_position', type: 'TEXT DEFAULT "grid"' },
        { table: 'settings', column: 'weather_position', type: 'TEXT DEFAULT "grid"' },
        { table: 'settings', column: 'clock_position', type: 'TEXT DEFAULT "grid"' },
        { table: 'settings', column: 'weather_size', type: 'TEXT DEFAULT "normal"' },
        { table: 'settings', column: 'weather_layout', type: 'TEXT DEFAULT "vertical"' },
        { table: 'settings', column: 'weather_display_size', type: 'TEXT DEFAULT "large"' },
        { table: 'settings', column: 'left_sidebar_open', type: 'INTEGER DEFAULT 1' },
        { table: 'settings', column: 'right_sidebar_open', type: 'INTEGER DEFAULT 1' },
        { table: 'settings', column: 'user_name', type: 'TEXT DEFAULT "Sparrow"' },
        { table: 'featured_links', column: 'parent_id', type: 'INTEGER DEFAULT NULL' },
        { table: 'featured_links', column: 'is_folder', type: 'INTEGER DEFAULT 0' },
        { table: 'bookmarks', column: 'parent_id', type: 'INTEGER DEFAULT NULL' },
        { table: 'bookmarks', column: 'is_folder', type: 'INTEGER DEFAULT 0' }
    ];

    for (const m of migrations) {
        try {
            db.prepare(`ALTER TABLE ${m.table} ADD COLUMN ${m.column} ${m.type}`).run();
        } catch (e) {
            // Expected failure if column already exists in SQLite
        }
    }

    seedDefaultData();
}

function seedDefaultData() {
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    if (userCount === 0) {
        // Create default user "sparrow"
        const userId = db.prepare(`
            INSERT INTO users (username, password_hash, vault_pin_hash)
            VALUES ('sparrow', '$2a$10$e8wF3Q.p0Q2N/9n3N2H0..5h3e8W7V1v8n.p0Q2N/9n3N2H0..5h3', null)
        `).run().lastInsertRowid;

        // Seed settings
        db.prepare('INSERT INTO settings (user_id) VALUES (?)').run(userId);

        // Seed Categories
        const cat1 = db.prepare('INSERT INTO categories (user_id, name, icon, color, position) VALUES (?, ?, ?, ?, ?)').run(userId, 'General & Search', '🔍', '#38bdf8', 0).lastInsertRowid;
        const cat2 = db.prepare('INSERT INTO categories (user_id, name, icon, color, position) VALUES (?, ?, ?, ?, ?)').run(userId, 'Developer Tools', '⚡', '#a855f7', 1).lastInsertRowid;
        const cat3 = db.prepare('INSERT INTO categories (user_id, name, icon, color, position) VALUES (?, ?, ?, ?, ?)').run(userId, 'Media & Social', '🍿', '#ec4899', 2).lastInsertRowid;
        const cat4 = db.prepare('INSERT INTO categories (user_id, name, icon, color, position, is_vault) VALUES (?, ?, ?, ?, ?, 1)').run(userId, 'Private Link Vault', '🔐', '#f43f5e', 3).lastInsertRowid;

        // Seed Bookmarks
        db.prepare('INSERT INTO bookmarks (category_id, title, url, description, icon, position) VALUES (?, ?, ?, ?, ?, ?)').run(cat1, 'Google', 'https://google.com', 'Search the web', '🔍', 0);
        db.prepare('INSERT INTO bookmarks (category_id, title, url, description, icon, position) VALUES (?, ?, ?, ?, ?, ?)').run(cat1, 'DuckDuckGo', 'https://duckduckgo.com', 'Privacy search', '🦆', 1);
        db.prepare('INSERT INTO bookmarks (category_id, title, url, description, icon, position) VALUES (?, ?, ?, ?, ?, ?)').run(cat1, 'SparrowForge Lab', 'https://sparrowforgelab.com', 'Official Portal', '🪶', 2);

        db.prepare('INSERT INTO bookmarks (category_id, title, url, description, icon, position) VALUES (?, ?, ?, ?, ?, ?)').run(cat2, 'GitHub', 'https://github.com', 'Code repository hosting', '🐙', 0);
        db.prepare('INSERT INTO bookmarks (category_id, title, url, description, icon, position) VALUES (?, ?, ?, ?, ?, ?)').run(cat2, 'ChatGPT', 'https://chatgpt.com', 'AI Assistant', '🤖', 1);
        db.prepare('INSERT INTO bookmarks (category_id, title, url, description, icon, position) VALUES (?, ?, ?, ?, ?, ?)').run(cat2, 'Stack Overflow', 'https://stackoverflow.com', 'Q&A for Developers', '📚', 2);

        db.prepare('INSERT INTO bookmarks (category_id, title, url, description, icon, position) VALUES (?, ?, ?, ?, ?, ?)').run(cat3, 'YouTube', 'https://youtube.com', 'Videos and Music', '📺', 0);
        db.prepare('INSERT INTO bookmarks (category_id, title, url, description, icon, position) VALUES (?, ?, ?, ?, ?, ?)').run(cat3, 'Twitch', 'https://twitch.tv', 'Live Streaming', '🎮', 1);
        db.prepare('INSERT INTO bookmarks (category_id, title, url, description, icon, position) VALUES (?, ?, ?, ?, ?, ?)').run(cat3, 'Reddit', 'https://reddit.com', 'Front page of the internet', '🤖', 2);

        // Vault link
        db.prepare('INSERT INTO bookmarks (category_id, title, url, description, icon, position, is_vault, encrypted_data) VALUES (?, ?, ?, ?, ?, ?, 1, ?)').run(
            cat4,
            'Encrypted Link',
            'https://protected-vault',
            'Encrypted at rest with AES-256',
            '🔑',
            0,
            JSON.stringify({
                title: '2282ce85828ea27943571ecbab4b715e:452ba73a8aa572ef427736923a34992f:43aad87b5f421b7cc3766f9e94ae18eec0955375ee6ae759',
                url: '6d79cbbb332476b3125cb0c5a1a441d5:9bc6039b2e0fd4f25b139e41f1653773:17915beb29758406edc838fa4456732a262b7a666029',
                description: '39e9f6580f089bd2a16c72e27606e987:b9acb2361665a043c7b77ab6803bd514:48d0dfa6c62c95353597b819f72c3d526715f6b95c0106f3'
            })
        );

        // Seed Featured Links
        db.prepare('INSERT INTO featured_links (user_id, title, url, icon, position) VALUES (?, ?, ?, ?, ?)').run(userId, 'SparrowForge Lab', 'https://sparrowforgelab.com', '🪶', 0);
        db.prepare('INSERT INTO featured_links (user_id, title, url, icon, position) VALUES (?, ?, ?, ?, ?)').run(userId, 'ChatGPT', 'https://chatgpt.com', '🤖', 1);
        db.prepare('INSERT INTO featured_links (user_id, title, url, icon, position) VALUES (?, ?, ?, ?, ?)').run(userId, 'GitHub', 'https://github.com', '🐙', 2);
        db.prepare('INSERT INTO featured_links (user_id, title, url, icon, position) VALUES (?, ?, ?, ?, ?)').run(userId, 'YouTube', 'https://youtube.com', '📺', 3);
    } else {
        // If user exists but featured_links table is empty, seed defaults
        const user = db.prepare('SELECT id FROM users LIMIT 1').get();
        if (user) {
            const featuredCount = db.prepare('SELECT COUNT(*) as count FROM featured_links WHERE user_id = ?').get(user.id).count;
            if (featuredCount === 0) {
                db.prepare('INSERT INTO featured_links (user_id, title, url, icon, position) VALUES (?, ?, ?, ?, ?)').run(user.id, 'SparrowForge Lab', 'https://sparrowforgelab.com', '🪶', 0);
                db.prepare('INSERT INTO featured_links (user_id, title, url, icon, position) VALUES (?, ?, ?, ?, ?)').run(user.id, 'ChatGPT', 'https://chatgpt.com', '🤖', 1);
                db.prepare('INSERT INTO featured_links (user_id, title, url, icon, position) VALUES (?, ?, ?, ?, ?)').run(user.id, 'GitHub', 'https://github.com', '🐙', 2);
                db.prepare('INSERT INTO featured_links (user_id, title, url, icon, position) VALUES (?, ?, ?, ?, ?)').run(user.id, 'YouTube', 'https://youtube.com', '📺', 3);
            }
        }
    }
}

initDb();

module.exports = db;
