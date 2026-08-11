const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeMetadata(req, res) {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'URL parameter is required' });

    try {
        const targetUrl = url.startsWith('http') ? url : `https://${url}`;
        const response = await axios.get(targetUrl, {
            timeout: 5000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const title = $('title').text().trim() || $('meta[property="og:title"]').attr('content') || new URL(targetUrl).hostname;
        const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
        const keywords = $('meta[name="keywords"]').attr('content') || '';

        // Extract favicon
        let favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || $('link[rel="apple-touch-icon"]').attr('href') || '';
        
        if (favicon && !favicon.startsWith('http')) {
            const baseUrl = new URL(targetUrl);
            favicon = new URL(favicon, baseUrl.origin).href;
        }

        if (!favicon) {
            const domain = new URL(targetUrl).hostname;
            favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        }

        res.json({
            title,
            description,
            keywords,
            favicon,
            domain: new URL(targetUrl).hostname
        });
    } catch (err) {
        // Fallback for metadata
        try {
            const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
            res.json({
                title: domain.charAt(0).toUpperCase() + domain.slice(1),
                description: '',
                keywords: '',
                favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
                domain
            });
        } catch (e) {
            res.status(500).json({ error: 'Failed to scrape metadata: ' + err.message });
        }
    }
}

/**
 * Icon Library CDN endpoints for manual icon search
 */
function getIconLibraries(req, res) {
    res.json({
        sources: [
            { name: 'Selfh.st Icons', url: 'https://selfh.st/icons/' },
            { name: 'TechIcons', url: 'https://techicons.dev/' },
            { name: 'Bootstrap Icons', url: 'https://icons.getbootstrap.com/' },
            { name: 'GetEmoji', url: 'https://getemoji.com/' }
        ]
    });
}

module.exports = {
    scrapeMetadata,
    getIconLibraries
};
