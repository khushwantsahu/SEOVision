const SEOAnalysis = require('../models/SEOAnalysis');
const KeywordTracking = require('../models/KeywordTracking');
const User = require('../models/User');
const mongoose = require('mongoose');


/**
 * @desc    Get stats for Dashboard overview
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch user details
    const user = await User.findById(userId);

    // Calculate daily scans remaining
    const today = new Date().setHours(0, 0, 0, 0);
    const lastScan = new Date(user.lastScanDate || 0).setHours(0, 0, 0, 0);
    let dailyScansUsed = user.dailyScanCount || 0;
    if (today > lastScan) {
      dailyScansUsed = 0;
    }

    const maxDailyScans = user.plan === 'PRO' ? 100 : 5;
    const scansRemaining = Math.max(0, maxDailyScans - dailyScansUsed);

    // Aggregate user analysis stats
    const totalScans = await SEOAnalysis.countDocuments({ userId });
    
    const avgScoreResult = await SEOAnalysis.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, avgScore: { $avg: '$score' } } }
    ]);


    const averageScore = avgScoreResult.length > 0 ? Math.round(avgScoreResult[0].avgScore) : 0;

    // Recent 5 analyses for the dashboard feed
    const recentAnalyses = await SEOAnalysis.find({ userId })
      .select('url domain score status createdAt issues')
      .sort({ createdAt: -1 })
      .limit(5);

    // Total keywords tracked
    const trackedKeywordsCount = await KeywordTracking.countDocuments({ userId });

    return res.status(200).json({
      success: true,
      data: {
        totalScans,
        averageScore,
        scansRemaining,
        dailyScansUsed,
        maxDailyScans,
        plan: user.plan,
        trackedKeywordsCount,
        recentAnalyses
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
