/**
 * Database Configuration
 * Connects to MongoDB using the existing connection utility
 */

const { connectDB } = require('../../database/connection');

const connectDatabase = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodball';
  
  try {
    await connectDB(mongoURI);
    console.log('Database connection established');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDatabase;

