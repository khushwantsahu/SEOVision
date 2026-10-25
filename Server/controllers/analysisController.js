const SEOAnalysis = require('../models/SEOAnalysis');
const User = require('../models/User');
const mongoose = require('mongoose');
const { crawlWebsite } = require('../services/crawlerService');
const { calculateSeoScore } = require('../services/seoScoreService');
const { generateAiRecommendations } = require('../services/aiService');


/**
 * @desc    Run SEO analysis on a website
 * @route   POST /api/analysis
 * @access  Private
 */
const createAnalysis = async (req, res, next) => {
  try {
    const { url } = req.body;
    const targetUrl = req.normalizedUrl || url;
    const userId = req.user._id;

    // Check user daily scan limits based on plan
    const user = await User.findById(userId);
    const today = new Date().setHours(0, 0, 0, 0);
    const lastScan = new Date(user.lastScanDate || 0).setHours(0, 0, 0, 0);

    let currentDailyScans = user.dailyScanCount || 0;
    if (today > lastScan) {
      currentDailyScans = 0; // Reset daily limit on new day
    }

    const maxDailyScans = user.plan === 'PRO' ? 100 : 5;
    if (currentDailyScans >= maxDailyScans) {
      return res.status(403).json({
        success: false,
        message: `Daily scan limit reached (${maxDailyScans} scans/day for ${user.plan} plan). Upgrade to PRO for higher limits.`
      });
    }

    // 1. Crawl website HTML & extract factors
    const seoData = await crawlWebsite(targetUrl);

    // 2. Compute deterministic score & categories
    const scoringResult = calculateSeoScore(seoData);

    // 3. Generate AI insights & recommendations
    const aiInsights = await generateAiRecommendations(seoData, scoringResult);

    // 4. Save analysis record in MongoDB
    const analysis = await SEOAnalysis.create({
      userId,
      url: targetUrl,
      domain: seoData.domain,
      score: scoringResult.score,
      categoryScores: scoringResult.categoryScores,
      seoData,
      issues: scoringResult.issues,
      recommendations: scoringResult.recommendations,
      aiInsights,
      keywords: seoData.keywords,
      status: 'completed'
    });

    // 5. Update user daily scan count
    user.dailyScanCount = currentDailyScans + 1;
    user.lastScanDate = new Date();
    await user.save();

    return res.status(201).json({
      success: true,
      message: 'Analysis completed successfully',
      data: {
        id: analysis._id,
        url: analysis.url,
        domain: analysis.domain,
        score: analysis.score,
        categoryScores: analysis.categoryScores,
        issues: analysis.issues,
        recommendations: analysis.recommendations,
        aiInsights: analysis.aiInsights,
        seoData: analysis.seoData,
        keywords: analysis.keywords,
        createdAt: analysis.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all analyses for current user (History & Insights)
 * @route   GET /api/analysis
 * @access  Private
 */
const getAnalyses = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { search, sortBy } = req.query;

    let query = { userId };

    if (search) {
      query.$or = [
        { domain: { $regex: search, $options: 'i' } },
        { url: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 }; // default newest first
    if (sortBy === 'score_desc') sortOption = { score: -1 };
    if (sortBy === 'score_asc') sortOption = { score: 1 };
    if (sortBy === 'oldest') sortOption = { createdAt: 1 };

    const analyses = await SEOAnalysis.find(query)
      .select('url domain score categoryScores status createdAt issues')
      .sort(sortOption);

    return res.status(200).json({
      success: true,
      count: analyses.length,
      data: analyses
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single SEO analysis by ID
 * @route   GET /api/analysis/:id
 * @access  Private
 */
const getAnalysisById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid analysis ID format' });
    }
    const analysis = await SEOAnalysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis report not found'
      });
    }

    // Security Check: Enforce user data isolation
    if (analysis.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to access this analysis report'
      });
    }

    return res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete SEO analysis by ID
 * @route   DELETE /api/analysis/:id
 * @access  Private
 */
const deleteAnalysis = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid analysis ID format' });
    }
    const analysis = await SEOAnalysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis record not found'
      });
    }

    // Security Check: Enforce user data isolation
    if (analysis.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You cannot delete another user\'s analysis record'
      });
    }

    await analysis.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Analysis record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAnalysis,
  getAnalyses,
  getAnalysisById,
  deleteAnalysis
};
