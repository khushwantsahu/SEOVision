const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    plan: {
      type: String,
      enum: ['FREE', 'PRO'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    provider: {
      type: String,
      enum: ['stripe', 'razorpay', 'mock'],
      default: 'mock'
    },
    transactionId: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ['succeeded', 'failed', 'pending'],
      default: 'succeeded'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Payment', paymentSchema);
