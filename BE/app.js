require('dotenv').config();  // โหลด .env
const express = require('express');
const cors = require('cors');
const app = express();
const paymentRoutes = require('./routes/payment');
const webhookRoutes = require('./routes/webhook');

// เปิด cors ทุกโดเมน
app.use(cors());
app.use(cors({
  origin: 'http://localhost:8080', // อนุญาตให้ FE เข้ามา
  credentials: true
}));

app.use(express.json());

// เส้นทาง API
app.use('/api/payment', paymentRoutes);
app.use('/api/webhook', webhookRoutes);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


