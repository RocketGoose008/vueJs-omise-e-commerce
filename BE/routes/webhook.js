const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.post('/omise', bodyParser.json(), async (req, res) => {
  const event = req.body;

  console.log("Webhook event received: ", event);

  if (event.key === 'charge.complete') {
    const charge = event.data;

    if (charge.status === 'successful' && charge.paid) {
      console.log('# Payment successful for charge:', charge.id);
      // TODO: อัปเดตสถานะคำสั่งซื้อในฐานข้อมูลของคุณที่นี่
    } else {
      console.log('# Payment failed or incomplete:', charge.id);
      // TODO: จัดการกรณีล้มเหลว (เช่น แจ้งเตือน user)
    }
  }

  // ตอบกลับ Omise ว่ารับข้อมูลแล้ว
  res.status(200).send('Webhook received');
});

module.exports = router;
