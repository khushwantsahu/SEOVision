const express = require('express');
const router = express.Router();
const {
  createAnalysis,
  getAnalyses,
  getAnalysisById,
  deleteAnalysis
} = require('../controllers/analysisController');
const { protect } = require('../middleware/authMiddleware');
const validateUrlMiddleware = require('../middleware/validateUrl');

router.use(protect);

router.post('/', validateUrlMiddleware, createAnalysis);
router.get('/', getAnalyses);
router.get('/:id', getAnalysisById);
router.delete('/:id', deleteAnalysis);

module.exports = router;
