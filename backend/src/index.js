const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const db = require('./models/db');
const { authenticateToken, verifyVaultUnlock } = require('./middleware/auth');

const authController = require('./controllers/authController');
const bookmarkController = require('./controllers/bookmarkController');
const featuredController = require('./controllers/featuredController');
const dockController = require('./controllers/dockController');
const scraperController = require('./controllers/scraperController');
const widgetController = require('./controllers/widgetController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cookieParser());

// Static Uploads Storage
const uploadsDir = path.join(__dirname, '../data/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Static files for production frontend
const frontendDist = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));

// --- API Routes ---

// Auth & Vault Routes
app.post('/api/auth/login', authController.login);
app.post('/api/auth/register', authController.register);
app.post('/api/auth/logout', authController.logout);
app.post('/api/auth/vault/verify', authenticateToken, authController.verifyVaultPin);
app.post('/api/auth/vault/lock', authController.lockVault);
app.get('/api/auth/status', verifyVaultUnlock, authController.checkStatus);

// Dashboard Data
app.get('/api/dashboard', authenticateToken, verifyVaultUnlock, bookmarkController.getDashboardData);

// Categories
app.post('/api/categories', authenticateToken, bookmarkController.createCategory);
app.put('/api/categories/reorder', authenticateToken, bookmarkController.reorderCategories);
app.put('/api/categories/:id', authenticateToken, bookmarkController.updateCategory);
app.delete('/api/categories/:id', authenticateToken, bookmarkController.deleteCategory);

// Bookmarks
app.post('/api/bookmarks', authenticateToken, bookmarkController.createBookmark);
app.put('/api/bookmarks/reorder', authenticateToken, bookmarkController.reorderBookmarks);
app.put('/api/bookmarks/:id', authenticateToken, bookmarkController.updateBookmark);
app.delete('/api/bookmarks/:id', authenticateToken, bookmarkController.deleteBookmark);

// Featured / Pinned Links
app.get('/api/featured-links', authenticateToken, featuredController.getFeaturedLinks);
app.post('/api/featured-links', authenticateToken, featuredController.createFeaturedLink);
app.put('/api/featured-links/reorder', authenticateToken, featuredController.reorderFeaturedLinks);
app.put('/api/featured-links/:id', authenticateToken, featuredController.updateFeaturedLink);
app.delete('/api/featured-links/:id', authenticateToken, featuredController.deleteFeaturedLink);

// Dock Links & Pin to Dock
app.get('/api/dock-links', authenticateToken, dockController.getDockLinks);
app.post('/api/dock-links', authenticateToken, dockController.createDockLink);
app.post('/api/dock-links/toggle-bookmark', authenticateToken, dockController.toggleBookmarkDock);
app.put('/api/dock-links/reorder', authenticateToken, dockController.reorderDockLinks);
app.put('/api/dock-links/:id', authenticateToken, dockController.updateDockLink);
app.delete('/api/dock-links/:id', authenticateToken, dockController.deleteDockLink);

// Bookmark Import / Export
app.post('/api/bookmarks/import', authenticateToken, bookmarkController.importBookmarks);
app.get('/api/bookmarks/export', authenticateToken, bookmarkController.exportBookmarks);

// Scraper & Icon CDN
app.get('/api/scraper/scrape', scraperController.scrapeMetadata);
app.get('/api/scraper/icons', scraperController.getIconLibraries);

// Widgets & Settings
app.get('/api/widgets/weather', widgetController.getWeather);
app.get('/api/widgets/weather/search', widgetController.searchLocation);
app.get('/api/widgets/rss', widgetController.getRssFeed);
app.get('/api/widgets/calendar', widgetController.getCalendarEvents);

app.get('/api/widgets/todos', authenticateToken, widgetController.getTodos);
app.post('/api/widgets/todos', authenticateToken, widgetController.createTodo);
app.put('/api/widgets/todos/:id/toggle', authenticateToken, widgetController.toggleTodo);
app.delete('/api/widgets/todos/:id', authenticateToken, widgetController.deleteTodo);

app.put('/api/settings', authenticateToken, widgetController.updateSettings);
app.post('/api/settings/upload-background', authenticateToken, widgetController.uploadBackground);

// SPA Fallback
app.get('*', (req, res) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
        return res.status(404).json({ error: 'Endpoint not found' });
    }
    res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
        if (err) {
            res.status(200).send('Nest 3.0 API Running');
        }
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Nest 3.0 Backend Server listening on port ${PORT}`);
});
