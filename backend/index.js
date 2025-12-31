const express = require('express');
const path = require('path');
const session = require('express-session'); // For session management
const expressLayouts = require('express-ejs-layouts'); // For EJS layouts
const db = require('./models');

// Import API routes
const articleApiRoutes = require('./routes/api/articles');
const bannerApiRoutes = require('./routes/api/banners');
const statLogApiRoutes = require('./routes/api/statlogs');

// Initialize Express app
const app = express();
const port = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts middleware
app.use(expressLayouts);
app.set('layout', 'public/layout'); // Default layout for public pages

// Middleware to parse JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public'))); // Uncommented this line

// Configure express-session middleware
app.use(session({
    secret: 'your_secret_key', // Replace with a strong secret in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS. Ensure HTTPS is used in production.
}));

// Simple in-memory admin credentials for now
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password'; // In a real app, hash this password!

// Authentication middleware to protect admin routes
function isAuthenticated(req, res, next) {
    if (req.session && req.session.isAuthenticated) {
        return next();
    }
    req.session.returnTo = req.originalUrl; // Store original URL for redirection after login
    res.redirect('/admin/login');
}

// Admin login routes
app.get('/admin/login', (req, res) => {
    app.set('layout', 'admin/layout'); // Use admin layout for login page
    const errorMessage = req.session.errorMessage;
    req.session.errorMessage = null; // Clear error message
    res.render('admin/login', { error: errorMessage, title: '管理員登入' });
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        req.session.isAuthenticated = true;
        const redirectTo = req.session.returnTo || '/admin';
        delete req.session.returnTo; // Clear stored URL
        res.redirect(redirectTo);
    } else {
        req.session.errorMessage = '使用者名稱或密碼錯誤';
        res.redirect('/admin/login');
    }
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.redirect('/admin'); // Redirect to admin homepage on error
        }
        res.clearCookie('connect.sid'); // Clear session cookie
        res.redirect('/admin/login');
    });
});

// Admin dashboard routes (protected)
app.get('/admin', isAuthenticated, (req, res) => {
    app.set('layout', 'admin/layout'); // Use admin layout for admin pages
    res.redirect('/admin/articles'); // Default admin page
});

// Use API routes
app.use('/api/articles', articleApiRoutes);
app.use('/api/banners', bannerApiRoutes);
app.use('/api/statlogs', statLogApiRoutes);

// Admin UI routes (protected)
app.get('/admin/articles', isAuthenticated, async (req, res) => {
    app.set('layout', 'admin/layout');
    try {
        const articles = await db.Article.findAll({ order: [['createdAt', 'DESC']] });
        res.render('admin/content', { articles, title: '內容管理' });
    } catch (error) {
        console.error('Error fetching articles for admin:', error);
        res.status(500).render('admin/error', { title: '錯誤', message: '無法載入文章列表' });
    }
});

app.get('/admin/banners', isAuthenticated, async (req, res) => {
    app.set('layout', 'admin/layout');
    try {
        const banners = await db.Banner.findAll({ order: [['id', 'ASC']] });
        res.render('admin/banner', { banners, title: 'Banner 管理' });
    } catch (error) {
        console.error('Error fetching banners for admin:', error);
        res.status(500).render('admin/error', { title: '錯誤', message: '無法載入 Banner 列表' });
    }
});

app.get('/admin/stats', isAuthenticated, async (req, res) => {
    app.set('layout', 'admin/layout');
    try {
        const stats = await db.StatLog.findAll(); // Or use a summary method, but for now fetch all
        res.render('admin/stats', { stats, title: '統計報表' });
    } catch (error) {
        console.error('Error fetching stats for admin:', error);
        res.status(500).render('admin/error', { title: '錯誤', message: '無法載入統計數據' });
    }
});


// Public UI routes
app.get('/', async (req, res) => {
    app.set('layout', 'public/layout'); // Use public layout for public pages
    res.render('public/home', { title: '首頁' });
});

app.get('/articles', async (req, res) => {
    app.set('layout', 'public/layout');
    try {
        const articles = await db.Article.findAll({
            where: { status: 'UP' }, // Only show active articles
            order: [['createdAt', 'DESC']]
        });
        res.render('public/articles', { articles, title: '所有文章' });
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).render('public/error', { title: '錯誤', message: '無法載入文章' });
    }
});

app.get('/articles/:id', async (req, res) => {
    app.set('layout', 'public/layout');
    try {
        const article = await db.Article.findByPk(req.params.id);
        if (article && article.status === 'UP') {
            // Log page view
            const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            await db.StatLog.create({
                logType: 'PAGE_VIEW',
                targetId: article.id,
                logTime: new Date(),
                ipAddress: clientIp
            });
            // Increment view count (simple approach)
            article.viewCount = (article.viewCount || 0) + 1;
            await article.save(); // Save the updated view count
            res.render('public/article-detail', { article, title: article.titleZh });
        } else {
            res.status(404).render('public/error', { title: '文章未找到', message: '您請求的文章可能不存在或已被刪除' });
        }
    } catch (error) {
        console.error('Error fetching article details:', error);
        res.status(500).render('public/error', { title: '錯誤', message: '無法載入文章詳情' });
    }
});

// Generic error handling for 404
app.use((req, res, next) => {
    app.set('layout', 'public/layout'); // Ensure 404 uses public layout
    res.status(404).render('public/error', { title: '頁面未找到', message: '您請求的頁面不存在。' });
});

// Start the server after the database is synced
db.sequelize.sync({ alter: true }).then(() => { // Use {alter: true} for development to update schema
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
      console.log('Database synced!');
    });
});