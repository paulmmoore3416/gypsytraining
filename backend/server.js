/**
 * Gypsy's Training Journey - Backend API Server
 * Provides sync capabilities between web app and Android mobile app
 *
 * @author Paul Moore
 * @description Backend for service dog training documentation system
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const trainingRoutes = require('./routes/training');
const journalRoutes = require('./routes/journal');
const photoRoutes = require('./routes/photos');
const nutritionRoutes = require('./routes/nutrition');
const syncRoutes = require('./routes/sync');
const certificateRoutes = require('./routes/certificates');

// Import database initialization
const { initDatabase } = require('./database/init');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const regex = new RegExp(allowed.replace('*', '.*'));
        return regex.test(origin);
      }
      return allowed === origin;
    });

    if (!origin || isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS),
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Gypsy Training API',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/certificates', certificateRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Gypsy\'s Training Journey API',
    version: '1.0.0',
    description: 'Backend API for syncing training data between web and mobile apps',
    endpoints: {
      auth: '/api/auth',
      training: '/api/training',
      journal: '/api/journal',
      photos: '/api/photos',
      nutrition: '/api/nutrition',
      sync: '/api/sync'
    },
    documentation: 'See README.md for full API documentation'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Initialize database and start server
async function startServer() {
  try {
    await initDatabase();
    console.log('✓ Database initialized successfully');

    app.listen(PORT, () => {
      console.log('');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('  🐕 Gypsy\'s Training Journey - API Server');
      console.log('═══════════════════════════════════════════════════════════');
      console.log(`  Server running on port ${PORT}`);
      console.log(`  Environment: ${process.env.NODE_ENV}`);
      console.log(`  Health check: http://localhost:${PORT}/health`);
      console.log(`  API docs: http://localhost:${PORT}/api`);
      console.log('═══════════════════════════════════════════════════════════');
      console.log('');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

startServer();

module.exports = app;
