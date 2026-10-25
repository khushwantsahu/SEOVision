const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    plan: {
      type: String,
      enum: ['FREE', 'PRO'],
      default: 'FREE'
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'past_due', 'expired'],
      default: 'active'
    },
    provider: {
      type: String,
      enum: ['stripe', 'razorpay', 'mock'],
      default: 'mock'
    },
    subscriptionId: {
      type: String,
      default: ''
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
