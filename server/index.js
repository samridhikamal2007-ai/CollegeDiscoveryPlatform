const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const importData = require('./seeder');
const jobRoutes = require('./routes/jobs');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const collegeRoutes = require('./routes/colleges');
const examRoutes = require('./routes/exams');
const cors = require('cors');

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Check if seeder should run
if (process.argv.includes('--seed')) {
    importData();
    process.exit(0);
}

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/exams', examRoutes);

// Test route
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'RightPlace API is running! 🚀' });
});

// Seed route (for production)
app.post('/api/seed', async (req, res) => {
    try {
        await importData();
        res.json({ success: true, message: 'Database seeded successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌱 Seed jobs: npm run seed or POST /api/seed`);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
});

