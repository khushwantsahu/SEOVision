const { calculateSeoScore } = require('../services/seoScoreService');

describe('SEO Score Calculation Service', () => {
  it('should calculate high score for a perfect SEO page fixture', () => {
    const perfectFixture = {
      domain: 'example.com',
      isHttps: true,
      title: 'Awesome SEO Vision Dashboard - Track Rankings Online',
      titleLength: 52,
      metaDescription: 'Discover comprehensive AI-powered SEO analysis, track keyword rankings, and optimize your web performance effortlessly.',
      descriptionLength: 135,
      canonicalUrl: 'https://example.com/',
      robotsMeta: 'index, follow',
      hasRobotsTxt: true,
      hasSitemap: true,
      viewport: true,
      htmlLang: 'en',
      headings: {
        h1Count: 1,
        h2Count: 4,
        h3Count: 8,
        h1List: ['Awesome SEO Vision Dashboard']
      },
      images: {
        total: 10,
        missingAlt: 0,
        altCoverage: 100
      },
      links: {
        internal: 15,
        external: 5,
        total: 20
      },
      performanceMetrics: {
        responseTimeMs: 250,
        htmlSizeBytes: 45000,
        resourceCounts: { images: 10, scripts: 3, styles: 2 }
      },
      structuredDataFound: true
    };

    const result = calculateSeoScore(perfectFixture);

    expect(result.score).toBeGreaterThanOrEqual(90);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.categoryScores.technical).toBe(100);
    expect(result.categoryScores.onPage).toBe(100);
    expect(result.categoryScores.accessibility).toBe(100);
  });

  it('should penalize pages missing HTTPS, title, meta description, and H1', () => {
    const poorFixture = {
      domain: 'unoptimized-site.com',
      isHttps: false,
      title: '',
      titleLength: 0,
      metaDescription: '',
      descriptionLength: 0,
      canonicalUrl: '',
      robotsMeta: '',
      hasRobotsTxt: false,
      hasSitemap: false,
      viewport: false,
      htmlLang: '',
      headings: {
        h1Count: 0,
        h2Count: 0,
        h3Count: 0,
        h1List: []
      },
      images: {
        total: 5,
        missingAlt: 5,
        altCoverage: 0
      },
      links: {
        internal: 0,
        external: 0,
        total: 0
      },
      performanceMetrics: {
        responseTimeMs: 3500,
        htmlSizeBytes: 450000,
        resourceCounts: { images: 5, scripts: 15, styles: 8 }
      },
      structuredDataFound: false
    };

    const result = calculateSeoScore(poorFixture);

    expect(result.score).toBeLessThan(40);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.issues.length).toBeGreaterThan(5);
  });

  it('should remain deterministic - same input produces exact same score', () => {
    const fixture = {
      domain: 'test.com',
      isHttps: true,
      title: 'Test Page Title Example',
      titleLength: 23,
      metaDescription: 'Short meta description',
      descriptionLength: 22,
      canonicalUrl: 'https://test.com',
      robotsMeta: 'index',
      hasRobotsTxt: true,
      hasSitemap: false,
      viewport: true,
      htmlLang: 'en',
      headings: { h1Count: 1, h2Count: 2, h3Count: 0, h1List: ['Heading'] },
      images: { total: 2, missingAlt: 1, altCoverage: 50 },
      links: { internal: 3, external: 1, total: 4 },
      performanceMetrics: { responseTimeMs: 800, htmlSizeBytes: 60000, resourceCounts: { images: 2, scripts: 2, styles: 1 } },
      structuredDataFound: false
    };

    const run1 = calculateSeoScore(fixture);
    const run2 = calculateSeoScore(fixture);

    expect(run1.score).toBe(run2.score);
    expect(run1.categoryScores).toEqual(run2.categoryScores);
  });
});
