const express = require('express');
const router = express.Router();
const {
  getSubscription,
  createCheckoutSession,
  webhookHandler
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getSubscription);
router.post('/checkout', protect, createCheckoutSession);
router.post('/webhook', webhookHandler);

module.exports = router;
