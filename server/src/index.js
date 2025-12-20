const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/uploads');

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/uploads', uploadRoutes);
app.get('/', (req, res) => res.send('RR Products Manufacturing - Stock Management API'));
app.get('/api', (req, res) => res.json({ 
  message: 'RR Products Manufacturing API',
  version: '1.0.0',
  endpoints: {
    products: '/api/products',
    auth: '/api/auth',
    uploads: '/api/uploads'
  }
}));

const start = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('[server] MONGODB_URI is not set. API will start, but database operations may fail.');
    } else {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('[server] Connected to MongoDB');
    }
  } catch (err) {
    console.error('[server] MongoDB connection error:', err?.message || err);
  }

  app.listen(PORT, () => {
    console.log(`[server] API listening on port ${PORT}`);
  });
};

start();

