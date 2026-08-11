const axios = require('axios');
const Parser = require('rss-parser');
const ical = require('node-ical');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const db = require('../models/db');

const rssParser = new Parser({
    timeout: 8000,
    headers: { 'User-Agent': 'Nest3-Dashboard/3.0' }
});

// Setup Multer Storage for Custom Background Wallpapers
const uploadsDir = path.join(__dirname, '../../data/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname) || '.png';
        const uniqueName = `bg-${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
        cb(null, uniqueName);
    }
});

const uploadMiddleware = multer({
    storage: storage,
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max file size
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (PNG, JPG, WEBP, GIF) are allowed!'));
        }
    }
}).single('wallpaper');

function uploadBackground(req, res) {
    uploadMiddleware(req, res, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'No wallpaper image file uploaded' });
        }
        const publicUrl = `/uploads/${req.file.filename}`;
        res.json({ success: true, url: publicUrl });
    });
}

/**
 * 1. Weather Widget (Open-Meteo API integration)
 */
async function getWeather(req, res) {
    const { lat = 51.5074, lon = -0.1278, units = 'celsius', days = 5 } = req.query;

    try {
        const isFahrenheit = units === 'fahrenheit';
        const tempUnit = isFahrenheit ? 'fahrenheit' : 'celsius';
        const windUnit = isFahrenheit ? 'mph' : 'kmh';
        const forecastDays = Math.min(Math.max(parseInt(days, 10) || 5, 1), 10);

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&forecast_days=${forecastDays}&temperature_unit=${tempUnit}&windspeed_unit=${windUnit}&timezone=auto`;

        const response = await axios.get(url, { timeout: 5000 });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch weather data: ' + err.message });
    }
}

async function searchLocation(req, res) {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Query is required' });

    const trimmed = query.trim();

    // Check if query is raw coordinates e.g. "40.7128, -74.0060" or "40.7128 -74.0060"
    const coordMatch = trimmed.match(/^([-+]?\d{1,2}\.\d+)[,\s]+([-+]?\d{1,3}\.\d+)$/);
    if (coordMatch) {
        const lat = parseFloat(coordMatch[1]);
        const lon = parseFloat(coordMatch[2]);
        return res.json([
            {
                name: `Coordinates (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
                country: 'Custom Location',
                latitude: lat,
                longitude: lon
            }
        ]);
    }

    try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=8&language=en&format=json`;
        const response = await axios.get(url, { timeout: 5000 });
        const results = (response.data.results || []).map(r => ({
            id: r.id,
            name: r.name,
            admin1: r.admin1 || '',
            country: r.country || '',
            country_code: r.country_code || '',
            latitude: r.latitude,
            longitude: r.longitude,
            formatted: [r.name, r.admin1, r.country].filter(Boolean).join(', ')
        }));

        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Failed to search location: ' + err.message });
    }
}

/**
 * 2. RSS Reader Widget
 */
async function getRssFeed(req, res) {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'RSS Feed URL is required' });

    try {
        const feed = await rssParser.parseURL(url);
        const items = (feed.items || []).slice(0, 10).map(item => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate || item.isoDate,
            snippet: item.contentSnippet || item.summary || '',
            thumbnail: item.enclosure?.url || null
        }));

        res.json({
            title: feed.title || 'RSS Feed',
            description: feed.description || '',
            link: feed.link,
            items
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to parse RSS feed: ' + err.message });
    }
}

/**
 * 3. Calendar iCal/ICS Parser
 */
async function getCalendarEvents(req, res) {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'Calendar ICS URL is required' });

    try {
        const events = await ical.async.fromURL(url);
        const eventList = [];

        const now = new Date();
        const futureLimit = new Date();
        futureLimit.setDate(now.getDate() + 30);

        for (const k in events) {
            if (events.hasOwnProperty(k)) {
                const ev = events[k];
                if (ev.type === 'VEVENT') {
                    const start = new Date(ev.start);
                    if (start >= now && start <= futureLimit) {
                        eventList.push({
                            summary: ev.summary || 'Event',
                            start: ev.start,
                            end: ev.end,
                            location: ev.location || '',
                            description: ev.description || ''
                        });
                    }
                }
            }
        }

        eventList.sort((a, b) => new Date(a.start) - new Date(b.start));

        res.json({ events: eventList.slice(0, 15) });
    } catch (err) {
        res.status(500).json({ error: 'Failed to parse calendar feed: ' + err.message });
    }
}

/**
 * 4. To-Do Tasks CRUD
 */
function getTodos(req, res) {
    const userId = req.user.id;
    const todos = db.prepare('SELECT * FROM todos WHERE user_id = ? ORDER BY position ASC, created_at DESC').all(userId);
    res.json(todos);
}

function createTodo(req, res) {
    const userId = req.user.id;
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const maxPos = db.prepare('SELECT MAX(position) as maxPos FROM todos WHERE user_id = ?').get(userId).maxPos || 0;
    const result = db.prepare('INSERT INTO todos (user_id, text, position) VALUES (?, ?, ?)').run(userId, text, maxPos + 1);

    res.json({ success: true, id: result.lastInsertRowid, text, completed: 0 });
}

function toggleTodo(req, res) {
    const { id } = req.params;
    const todo = db.prepare('SELECT completed FROM todos WHERE id = ?').get(id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });

    const newStatus = todo.completed ? 0 : 1;
    db.prepare('UPDATE todos SET completed = ? WHERE id = ?').run(newStatus, id);

    res.json({ success: true, completed: newStatus });
}

function deleteTodo(req, res) {
    const { id } = req.params;
    db.prepare('DELETE FROM todos WHERE id = ?').run(id);
    res.json({ success: true });
}

/**
 * 5. Update User Settings (Guaranteed upsert & persistence)
 */
function updateSettings(req, res) {
    const userId = req.user.id;
    const settings = req.body;

    // Ensure settings row exists for user
    const existing = db.prepare('SELECT user_id FROM settings WHERE user_id = ?').get(userId);
    if (!existing) {
        db.prepare('INSERT INTO settings (user_id) VALUES (?)').run(userId);
    }

    const fields = [
        'theme', 'search_engine', 'column_count', 'font_size', 'layout_style',
        'view_mode', 'show_header', 'show_daily', 'show_dock', 'show_clock', 'show_weather',
        'show_rss', 'show_todo', 'show_calendar', 'clock_type', 'clock_format',
        'rss_position', 'todo_position', 'background_image',
        'background_blur', 'background_dim', 'weather_location',
        'weather_lat', 'weather_lon', 'weather_units', 'weather_size',
        'weather_layout', 'weather_display_size'
    ];

    const updates = [];
    const values = [];

    fields.forEach(field => {
        if (settings[field] !== undefined) {
            updates.push(`${field} = ?`);
            values.push(settings[field]);
        }
    });

    if (updates.length > 0) {
        values.push(userId);
        db.prepare(`UPDATE settings SET ${updates.join(', ')} WHERE user_id = ?`).run(...values);
    }

    const updatedSettings = db.prepare('SELECT * FROM settings WHERE user_id = ?').get(userId);
    res.json({ success: true, settings: updatedSettings });
}

module.exports = {
    getWeather,
    searchLocation,
    getRssFeed,
    getCalendarEvents,
    getTodos,
    createTodo,
    toggleTodo,
    deleteTodo,
    updateSettings,
    uploadBackground
};
