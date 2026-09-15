require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

app.use(express.json());
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

async function startServer() {
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
        autoIndex: true,
      });
      console.log('MongoDB connected successfully.');
    } catch (error) {
      console.error('MongoDB connection failed:', error.message);
      console.warn('Server will continue without a database connection.');
    }
  } else {
    console.warn('No MONGO_URI found in .env. Skipping MongoDB connection.');
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
