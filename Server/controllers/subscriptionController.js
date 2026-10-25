const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');
const User = require('../models/User');
const crypto = require('crypto');

/**
 * @desc    Get subscription status of current user
 * @route   GET /api/subscription
 * @access  Private
 */
const getSubscription = async (req, res, next) => {
  try {
    const userId = req.user._id;

    let sub = await Subscription.findOne({ userId });
    if (!sub) {
      sub = await Subscription.create({
        userId,
        plan: req.user.plan || 'FREE',
        status: 'active'
      });
    }

    return res.status(200).json({
      success: true,
      data: sub
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Initialize upgrade checkout / payment processing
 * @route   POST /api/subscription/checkout
 * @access  Private
 */
const createCheckoutSession = async (req, res, next) => {
  try {
    const { plan } = req.body;
    const userId = req.user._id;

    if (!plan || (plan !== 'FREE' && plan !== 'PRO')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription plan selected'
      });
    }

    const price = plan === 'PRO' ? 29 : 0;
    const transactionId = `txn_${crypto.randomBytes(8).toString('hex')}`;

    // Record Payment Entry
    const payment = await Payment.create({
      userId,
      plan,
      amount: price,
      currency: 'USD',
      provider: 'mock',
      transactionId,
      status: 'succeeded'
    });

    // Update Subscription Record
    let sub = await Subscription.findOne({ userId });
    if (!sub) {
      sub = new Subscription({ userId });
    }
    sub.plan = plan;
    sub.status = 'active';
    sub.startDate = new Date();
    await sub.save();

    // Upgrade User Plan
    const user = await User.findById(userId);
    user.plan = plan;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Successfully upgraded to ${plan} plan!`,
      data: {
        paymentId: payment._id,
        transactionId,
        plan: user.plan,
        amount: price
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Handle payment gateway webhook notifications
 * @route   POST /api/subscription/webhook
 * @access  Public (Webhook Endpoint)
 */
const webhookHandler = async (req, res, next) => {
  try {
    // Standard webhook processing logic structure
    const signature = req.headers['x-webhook-signature'];
    
    // Validate signature if webhook secret configured
    if (process.env.PAYMENT_WEBHOOK_SECRET && !signature) {
      return res.status(400).json({ success: false, message: 'Missing webhook signature' });
    }

    // Process event payload...
    return res.status(200).json({ success: true, received: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubscription,
  createCheckoutSession,
  webhookHandler
};
