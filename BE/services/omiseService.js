const omise = require('omise')({
  publicKey: process.env.OMISE_PUBLIC_KEY,
  secretKey: process.env.OMISE_SECRET_KEY,
});

async function createPromptPaySource({ amount, currency }) {
  if (!amount || !currency) {
    throw new Error('Missing required fields');
  }

  const source = await omise.sources.create({
    amount,
    currency,
    type: 'promptpay',
  });

  return {
    status: 'success',
    source,
  };
}


async function createCharge({ amount, currency, source, card }) {
  if (!amount) throw new Error('Missing amount');
  if (!currency) throw new Error('Missing currency');

  // สร้าง charge จากบัตรเครดิต
  if (card) {
    return await omise.charges.create({
      amount,
      currency,
      card,
      description: 'Charge from credit card',
    });
  }

  // สร้าง charge จาก source ที่ frontend ส่งมา (PromptPay หรืออื่นๆ)
  if (source) {
    return await omise.charges.create({
      amount,
      currency,
      source,
      description: 'Charge from source',
    });
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
  createPromptPaySource,
  createCharge,
  retrieveCharge,
};
