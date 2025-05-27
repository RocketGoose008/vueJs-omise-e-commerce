const express = require('express');
const router = express.Router();
const { createCharge, retrieveCharge } = require('../services/omiseService');

router.post('/create-charge', async (req, res) => {
  const { amount, currency = 'thb', source, card, source_type } = req.body;

  if (!amount) {
    return res.status(400).json({ error: 'Missing amount' });
  }

  try {
    const result = await createCharge({ amount, currency, source, card, source_type });

    // < Credit card >
    if (result.object === 'charge') {
      return res.status(200).json({
        code: 200,
        status: "success",
        msg: "Payment successful.",
        data: {
          id: result.id,
          status: result.status,
          paid: result.paid,
          amount: result.amount,
          currency: result.currency,
          transaction: result.transaction,
          createdAt: result.created_at,
        }
      });
    }

    // < PromptPay QR code >
    if (result.object === 'source' || result.source) {
      return res.status(200).json({
        code: 200,
        status: "success",
        msg: "PromptPay source created.",
        source: result.source || result,
      });
    }

    return res.status(400).json({
      code: 400,
      status: 'fail',
      msg: 'Unexpected result from Omise',
      result,
    });

  } catch (err) {
    console.error('Omise Charge Error:', err);
    return res.status(500).json({
      code: 500,
      status: 'fail',
      msg: 'Charge failed',
      err: err.message || err,
    });
  }
});

// ตรวจสอบสถานะ charge จาก Omise
router.get('/check-status/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Missing charge ID' });
  }

  try {
    const charge = await retrieveCharge(id);

    res.status(200).json({
      code: 200,
      status: 'success',
      msg: 'Charge status retrieved.',
      data: {
        id: charge.id,
        status: charge.status,
        paid: charge.paid,
        amount: charge.amount,
        currency: charge.currency,
        createdAt: charge.created_at,
      }
    });

  } catch (err) {
    console.error('Check Charge Error:', err);
    res.status(500).json({
      code: 500,
      status: 'fail',
      msg: 'Unable to check charge status',
      err: err.message || err,
    });
  }
});

module.exports = router;
