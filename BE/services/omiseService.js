const omise = require('omise')({
  publicKey: process.env.OMISE_PUBLIC_KEY,
  secretKey: process.env.OMISE_SECRET_KEY,
});

async function createCharge({ amount, currency, source, card, source_type }) {
  if (!amount) {
    throw new Error('Missing amount');
  }

  // < Credit card >
  if (card) {
    return await omise.charges.create({
      amount,
      currency,
      card,
      description: 'Charge from credit card',
    });
  }

  // < PromptPay QR code >
  // if (source) {
  //   return await omise.charges.create({
  //     amount,
  //     currency,
  //     source,
  //     description: 'Charge from source',
  //   });
  // }

  // < PromptPay - One Step >
  if (source_type === 'promptpay') {
    const createdSource = await omise.sources.create({
      amount,
      currency,
      type: 'promptpay',
    });

    const charge = await omise.charges.create({
      amount,
      currency,
      source: createdSource.id,
      description: 'PromptPay charge',
    });

    return charge; // object === 'charge'
  }

  // < Source ที่มาจาก frontend >
  if (source) {
    return await omise.charges.create({
      amount,
      currency,
      source,
      description: 'Charge from source',
    });
  }

  // < กรณี source ที่ frontend สร้างไว้แล้ว (เช่น PromptPay) >
  if (source_type === 'promptpay') {
    const createdSource = await omise.sources.create({
      amount,
      currency,
      type: 'promptpay',
    });

    // ส่ง source กลับไปให้ frontend ไปแสดง QR code
    return {
      source: createdSource,
    };
  }

  throw new Error('No valid payment method provided');
}

// สำหรับตรวจสอบสถานะ charge
async function retrieveCharge(chargeId) {
  if (!chargeId) {
    throw new Error('Missing charge ID');
  }

  return await omise.charges.retrieve(chargeId);
}


module.exports = {
  createCharge,
  retrieveCharge, 
};
