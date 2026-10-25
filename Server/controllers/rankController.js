const KeywordTracking = require('../models/KeywordTracking');
const { checkKeywordRank, updateKeywordHistory } = require('../services/rankTrackingService');

/**
 * @desc    Add new keyword for rank tracking
 * @route   POST /api/rank-tracker
 * @access  Private
 */
const addKeyword = async (req, res, next) => {
  try {
    const { keyword, targetUrl, searchEngine, location } = req.body;
    const userId = req.user._id;

    if (!keyword || !targetUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both keyword and target website URL'
      });
    }

    const cleanKeyword = keyword.trim();
    const cleanUrl = targetUrl.trim();

    // Check if keyword already exists for this user and URL
    const existing = await KeywordTracking.findOne({
      userId,
      keyword: cleanKeyword,
      targetUrl: cleanUrl
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You are already tracking this keyword for the specified target URL'
      });
    }

    // Determine initial ranking position
    const initialPosition = checkKeywordRank(cleanKeyword, cleanUrl);

    const keywordDoc = new KeywordTracking({
      userId,
      keyword: cleanKeyword,
      targetUrl: cleanUrl,
      searchEngine: searchEngine || 'Google',
      location: location || 'United States',
      currentPosition: initialPosition,
      previousPosition: initialPosition,
      bestPosition: initialPosition,
      status: 'active',
      history: [
        {
          position: initialPosition,
          checkedAt: new Date()
        }
      ]
    });

    await keywordDoc.save();

    return res.status(201).json({
      success: true,
      message: 'Keyword added for rank tracking',
      data: keywordDoc
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all tracked keywords for current user
 * @route   GET /api/rank-tracker
 * @access  Private
 */
const getKeywords = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { search, status } = req.query;

    let query = { userId };

    if (search) {
      query.$or = [
        { keyword: { $regex: search, $options: 'i' } },
        { targetUrl: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const keywords = await KeywordTracking.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: keywords.length,
      data: keywords
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get details for a single tracked keyword
 * @route   GET /api/rank-tracker/:id
 * @access  Private
 */
const getKeywordById = async (req, res, next) => {
  try {
    const keywordDoc = await KeywordTracking.findById(req.params.id);

    if (!keywordDoc) {
      return res.status(404).json({
        success: false,
        message: 'Tracked keyword not found'
      });
    }

    // Security check: User data isolation
    if (keywordDoc.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have access to this keyword record'
      });
    }

    return res.status(200).json({
      success: true,
      data: keywordDoc
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Refresh/update ranking position for a keyword
 * @route   PUT /api/rank-tracker/:id/refresh
 * @access  Private
 */
const updateKeywordRank = async (req, res, next) => {
  try {
    const keywordDoc = await KeywordTracking.findById(req.params.id);

    if (!keywordDoc) {
      return res.status(404).json({
        success: false,
        message: 'Tracked keyword not found'
      });
    }

    if (keywordDoc.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You cannot update another user\'s keyword'
      });
    }

    // Re-check rank position
    const newPosition = checkKeywordRank(keywordDoc.keyword, keywordDoc.targetUrl);
    updateKeywordHistory(keywordDoc, newPosition);

    await keywordDoc.save();

    return res.status(200).json({
      success: true,
      message: 'Keyword position updated successfully',
      data: keywordDoc
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a tracked keyword
 * @route   DELETE /api/rank-tracker/:id
 * @access  Private
 */
const deleteKeyword = async (req, res, next) => {
  try {
    const keywordDoc = await KeywordTracking.findById(req.params.id);

    if (!keywordDoc) {
      return res.status(404).json({
        success: false,
        message: 'Tracked keyword not found'
      });
    }

    if (keywordDoc.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You cannot delete another user\'s keyword'
      });
    }

    await keywordDoc.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Tracked keyword deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addKeyword,
  getKeywords,
  getKeywordById,
  updateKeywordRank,
  deleteKeyword
};
