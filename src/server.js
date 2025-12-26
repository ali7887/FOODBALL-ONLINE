/**
 * Server Entry Point
 */

const app = require('./app');
const config = require('./config');
const connectDatabase = require('./config/database');

// Connect to database
connectDatabase();

// Start server
const server = app.listen(config.port, () => {
  console.log(`🚀 Foodball API server running on port ${config.port}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

module.exports = server;

