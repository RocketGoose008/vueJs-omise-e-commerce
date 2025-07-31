require('dotenv').config();  // โหลด .env
const express = require('express');
const cors = require('cors');

const app = express();

// เปิด cors ทุกโดเมน
app.use(cors());
app.use(cors({
  origin: 'http://localhost:8080', // อนุญาตให้ FE เข้ามา
  credentials: true
}));

app.use(express.json());

// เส้นทาง API
const paymentRoutes = require('./routes/payment');
const webhookRoutes = require('./routes/webhook');
app.use('/api/payment', paymentRoutes);
app.use('/api/webhook', webhookRoutes);

module.exports = app; 
