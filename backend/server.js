import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import sheetsRoutes from './routes/sheets.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dashboard';
console.log('Attempting to connect to MongoDB at:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sheets', sheetsRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Dashboard API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 