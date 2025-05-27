const { createCharge } = require('../services/omiseService');

async function handleCreateCharge(req, res) {
  const { amount, currency, source } = req.body;

  try {
    const charge = await createCharge({ amount, currency, source });
    res.json(charge);
  } catch (error) {
    console.error('Error creating charge:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  handleCreateCharge
};
