const mongoose = require('mongoose');

const historyEntrySchema = new mongoose.Schema({
  position: { type: Number, required: true },
  checkedAt: { type: Date, default: Date.now }
});

const keywordTrackingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    keyword: {
      type: String,
      required: [true, 'Please provide a keyword to track'],
      trim: true
    },
    targetUrl: {
      type: String,
      required: [true, 'Please provide target website URL'],
      trim: true
    },
    searchEngine: {
      type: String,
      default: 'Google'
    },
    location: {
      type: String,
      default: 'United States'
    },
    currentPosition: {
      type: Number,
      default: 0
    },
    previousPosition: {
      type: Number,
      default: 0
    },
    bestPosition: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'unranked'],
      default: 'active'
    },
    history: [historyEntrySchema]
  },
  {
    timestamps: true
  }
);

// Prevent duplicate keywords for the same user and target URL
keywordTrackingSchema.index({ userId: 1, keyword: 1, targetUrl: 1 }, { unique: true });

module.exports = mongoose.model('KeywordTracking', keywordTrackingSchema);
