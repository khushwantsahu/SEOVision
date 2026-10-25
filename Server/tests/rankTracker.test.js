const { checkKeywordRank, updateKeywordHistory } = require('../services/rankTrackingService');

describe('Rank Tracker Service', () => {
  it('should deterministically calculate rank position for keyword & domain', () => {
    const pos1 = checkKeywordRank('seo tracking software', 'seovision.com');
    const pos2 = checkKeywordRank('seo tracking software', 'seovision.com');
    expect(pos1).toBe(pos2);
    expect(pos1).toBeGreaterThanOrEqual(1);
    expect(pos1).toBeLessThanOrEqual(50);
  });

  it('should correctly calculate position improvement change', () => {
    const mockKeywordDoc = {
      currentPosition: 15,
      previousPosition: 15,
      bestPosition: 15,
      history: [{ position: 15, checkedAt: new Date() }]
    };

    const result = updateKeywordHistory(mockKeywordDoc, 8);

    expect(result.currentPosition).toBe(8);
    expect(result.previousPosition).toBe(15);
    expect(result.bestPosition).toBe(8);
    expect(result.positionChange).toBe(7); // 15 - 8 = +7 improvement
    expect(mockKeywordDoc.history.length).toBe(2);
  });
});
