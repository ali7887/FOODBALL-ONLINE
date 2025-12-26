/**
 * Express Application Configuration
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Foodball API is running' });
});

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/players', require('./routes/player.routes'));
app.use('/api/transfers', require('./routes/transfer.routes'));
app.use('/api/rumors', require('./routes/rumor.routes'));
app.use('/api/votes', require('./routes/vote.routes'));
app.use('/api/gamification', require('./routes/gamification.routes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;

