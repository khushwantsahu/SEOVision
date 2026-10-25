const crypto = require('crypto');

/**
 * Calculates a realistic rank position for a keyword + domain pair.
 * In production, this service can be plugged into real SERP APIs (e.g., SerpAPI or DataForSEO).
 * Deterministically generates a position between 1 and 50 based on hash of domain + keyword.
 *
 * @param {string} keyword - Targeted search query
 * @param {string} targetUrl - Targeted website URL
 * @returns {number} Rank position (1 to 100)
 */
function checkKeywordRank(keyword, targetUrl) {
  if (!keyword || !targetUrl) return 99;

  let domain = targetUrl;
  try {
    const parsed = new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`);
    domain = parsed.hostname.toLowerCase().replace('www.', '');
  } catch (e) {
    domain = targetUrl.toLowerCase();
  }

  // Create hash to ensure deterministic position result for same keyword + domain combo
  const hash = crypto.createHash('md5').update(`${domain}:${keyword.toLowerCase()}`).digest('hex');
  const num = parseInt(hash.substring(0, 8), 16);

  // Position between 1 and 45
  const position = (num % 45) + 1;
  return position;
}

/**
 * Updates keyword record with a new rank check and appends to history.
 *
 * @param {Object} keywordDoc - Mongoose KeywordTracking document
 * @param {number} newPosition - Newly checked rank position
 * @returns {Object} Updated fields
 */
function updateKeywordHistory(keywordDoc, newPosition) {
  const previousPosition = keywordDoc.currentPosition || newPosition;
  const bestPosition =
    keywordDoc.bestPosition === 0
      ? newPosition
      : Math.min(keywordDoc.bestPosition, newPosition);

  const historyEntry = {
    position: newPosition,
    checkedAt: new Date()
  };

  keywordDoc.previousPosition = previousPosition;
  keywordDoc.currentPosition = newPosition;
  keywordDoc.bestPosition = bestPosition;
  keywordDoc.history.push(historyEntry);

  // Maintain max 30 history entries
  if (keywordDoc.history.length > 30) {
    keywordDoc.history.shift();
  }

  return {
    currentPosition: newPosition,
    previousPosition,
    bestPosition,
    positionChange: previousPosition - newPosition // Positive value means rank improved
  };
}

module.exports = {
  checkKeywordRank,
  updateKeywordHistory
};
