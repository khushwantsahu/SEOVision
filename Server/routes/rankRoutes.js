const express = require('express');
const router = express.Router();
const {
  addKeyword,
  getKeywords,
  getKeywordById,
  updateKeywordRank,
  deleteKeyword
} = require('../controllers/rankController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', addKeyword);
router.get('/', getKeywords);
router.get('/:id', getKeywordById);
router.put('/:id/refresh', updateKeywordRank);
router.delete('/:id', deleteKeyword);

module.exports = router;
