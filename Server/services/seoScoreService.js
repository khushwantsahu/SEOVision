/**
 * SEO Score Calculation Service
 * Deterministically evaluates crawled SEO metrics and assigns scores (0-100)
 * across 6 distinct categories along with structured issues and recommendations.
 */

/**
 * Calculates category scores, overall SEO score, and detailed issues/recommendations.
 *
 * @param {Object} seoData - Extracted SEO metrics from crawler
 * @returns {Object} { score, categoryScores, issues, recommendations }
 */
function calculateSeoScore(seoData) {
  const issues = [];
  const recommendations = [];

  // 1. Technical SEO (Weight: 20%)
  let techScore = 100;
  if (!seoData.isHttps) {
    techScore -= 25;
    issues.push({
      title: 'Website is not using HTTPS',
      description: 'The website is served over HTTP instead of secure HTTPS, which harms search ranking and user trust.',
      category: 'Technical',
      severity: 'Critical',
      recommendation: 'Install an SSL/TLS certificate and enforce HTTPS redirection across your domain.'
    });
  }
  if (!seoData.canonicalUrl) {
    techScore -= 15;
    issues.push({
      title: 'Missing Canonical Link Tag',
      description: 'No canonical URL specified. Search engines may penalize duplicate content across variations.',
      category: 'Technical',
      severity: 'Warning',
      recommendation: 'Add a <link rel="canonical" href="..."> tag to point to the preferred canonical URL.'
    });
  }
  if (!seoData.hasRobotsTxt) {
    techScore -= 15;
    issues.push({
      title: 'Missing robots.txt File',
      description: 'No robots.txt file found at the root of the domain to guide search crawlers.',
      category: 'Technical',
      severity: 'Warning',
      recommendation: 'Create a robots.txt file in your root directory to instruct web crawlers.'
    });
  }
  if (!seoData.hasSitemap) {
    techScore -= 15;
    issues.push({
      title: 'Missing XML Sitemap',
      description: 'No sitemap.xml detected, making it harder for search engines to discover all your site pages.',
      category: 'Technical',
      severity: 'Warning',
      recommendation: 'Generate an XML sitemap and submit it to Google Search Console.'
    });
  }
  if (!seoData.structuredDataFound) {
    techScore -= 10;
    issues.push({
      title: 'No Structured Data (JSON-LD) Detected',
      description: 'Schema.org structured data was not found. Rich snippets will not appear in search results.',
      category: 'Technical',
      severity: 'Warning',
      recommendation: 'Implement JSON-LD schema markup for your website type (Organization, Article, Product).'
    });
  }
  techScore = Math.max(0, techScore);

  // 2. On-Page SEO (Weight: 25%)
  let onPageScore = 100;
  if (!seoData.title) {
    onPageScore -= 35;
    issues.push({
      title: 'Missing Title Tag',
      description: 'The page lacks a <title> tag. This is the single most important on-page SEO factor.',
      category: 'On-Page',
      severity: 'Critical',
      recommendation: 'Add a clear, unique title tag between 30 and 60 characters long.'
    });
  } else if (seoData.titleLength < 30 || seoData.titleLength > 60) {
    onPageScore -= 15;
    issues.push({
      title: `Suboptimal Title Tag Length (${seoData.titleLength} chars)`,
      description: 'Optimal title tag length is between 30 and 60 characters to avoid truncation in search results.',
      category: 'On-Page',
      severity: 'Warning',
      recommendation: 'Adjust your title tag length to be between 30 and 60 characters.'
    });
  }

  if (!seoData.metaDescription) {
    onPageScore -= 25;
    issues.push({
      title: 'Missing Meta Description',
      description: 'The page lacks a meta description tag, reducing click-through rates from search results.',
      category: 'On-Page',
      severity: 'Critical',
      recommendation: 'Write a compelling meta description tag between 120 and 160 characters.'
    });
  } else if (seoData.descriptionLength < 70 || seoData.descriptionLength > 160) {
    onPageScore -= 10;
    issues.push({
      title: `Suboptimal Meta Description Length (${seoData.descriptionLength} chars)`,
      description: 'Meta descriptions perform best when they are between 120 and 160 characters long.',
      category: 'On-Page',
      severity: 'Warning',
      recommendation: 'Optimize your meta description to be between 120 and 160 characters.'
    });
  }

  if (seoData.headings.h1Count === 0) {
    onPageScore -= 20;
    issues.push({
      title: 'Missing H1 Heading',
      description: 'No H1 heading tag found on the page. Every page should have exactly one primary H1 tag.',
      category: 'On-Page',
      severity: 'Critical',
      recommendation: 'Add one main H1 heading containing your target primary keyword.'
    });
  } else if (seoData.headings.h1Count > 1) {
    onPageScore -= 10;
    issues.push({
      title: `Multiple H1 Headings Found (${seoData.headings.h1Count})`,
      description: 'Having multiple H1 tags dilutes heading hierarchy and confuses search engine crawlers.',
      category: 'On-Page',
      severity: 'Warning',
      recommendation: 'Use only one H1 heading tag per page and use H2/H3 for subheadings.'
    });
  }
  onPageScore = Math.max(0, onPageScore);

  // 3. Performance (Weight: 20%)
  let perfScore = 100;
  const resTime = seoData.performanceMetrics.responseTimeMs;
  if (resTime > 3000) {
    perfScore -= 30;
    issues.push({
      title: `Slow Server Response Time (${resTime} ms)`,
      description: 'Initial server response took longer than 3 seconds, leading to high bounce rates.',
      category: 'Performance',
      severity: 'Critical',
      recommendation: 'Optimize database queries, use server Caching/CDN, and upgrade host resources.'
    });
  } else if (resTime > 1500) {
    perfScore -= 15;
    issues.push({
      title: `Moderate Response Time (${resTime} ms)`,
      description: 'Response time is acceptable but could be improved for better user experience.',
      category: 'Performance',
      severity: 'Warning',
      recommendation: 'Implement caching mechanisms and reduce server processing time.'
    });
  }

  const htmlKb = Math.round(seoData.performanceMetrics.htmlSizeBytes / 1024);
  if (htmlKb > 300) {
    perfScore -= 20;
    issues.push({
      title: `Large HTML Document Size (${htmlKb} KB)`,
      description: 'Excessive HTML size increases page download time and browser rendering delay.',
      category: 'Performance',
      severity: 'Warning',
      recommendation: 'Minify HTML code, remove redundant inline styles/scripts, and compress output.'
    });
  }
  perfScore = Math.max(0, perfScore);

  // 4. Accessibility (Weight: 15%)
  let accessScore = 100;
  if (!seoData.viewport) {
    accessScore -= 35;
    issues.push({
      title: 'Missing Viewport Meta Tag',
      description: 'Mobile responsiveness requires a properly configured viewport meta tag.',
      category: 'Accessibility',
      severity: 'Critical',
      recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> to <head>.'
    });
  }

  if (!seoData.htmlLang) {
    accessScore -= 20;
    issues.push({
      title: 'Missing HTML lang Attribute',
      description: 'Screen readers and search engines use the lang attribute to identify the page language.',
      category: 'Accessibility',
      severity: 'Warning',
      recommendation: 'Add lang attribute to <html> tag, e.g., <html lang="en">.'
    });
  }

  if (seoData.images.missingAlt > 0) {
    const penalty = Math.min(30, seoData.images.missingAlt * 5);
    accessScore -= penalty;
    issues.push({
      title: `${seoData.images.missingAlt} Images Missing ALT Attribute`,
      description: 'Image ALT attributes provide textual alternative for screen readers and image search engines.',
      category: 'Accessibility',
      severity: seoData.images.missingAlt > 3 ? 'Critical' : 'Warning',
      recommendation: 'Add descriptive ALT text to all informational <img> tags.'
    });
  }
  accessScore = Math.max(0, accessScore);

  // 5. Content (Weight: 10%)
  let contentScore = 100;
  if (seoData.headings.h2Count === 0) {
    contentScore -= 25;
    issues.push({
      title: 'No H2 Subheadings Found',
      description: 'Subheadings structure your content into logical sections for readers and search engines.',
      category: 'Content',
      severity: 'Warning',
      recommendation: 'Organize long-form content using H2 subheadings with related keywords.'
    });
  }
  if (seoData.links.internal === 0) {
    contentScore -= 20;
    issues.push({
      title: 'No Internal Links Detected',
      description: 'Internal links distribute link authority and help users navigate relevant pages.',
      category: 'Content',
      severity: 'Warning',
      recommendation: 'Add contextual links pointing to key inner pages on your domain.'
    });
  }
  contentScore = Math.max(0, contentScore);

  // 6. Best Practices (Weight: 10%)
  let bestPracticesScore = 100;
  if (!seoData.isHttps) bestPracticesScore -= 30;
  if (!seoData.viewport) bestPracticesScore -= 30;
  if (seoData.links.external === 0) {
    bestPracticesScore -= 10;
  }
  bestPracticesScore = Math.max(0, bestPracticesScore);

  // Category summary map
  const categoryScores = {
    technical: Math.round(techScore),
    onPage: Math.round(onPageScore),
    performance: Math.round(perfScore),
    accessibility: Math.round(accessScore),
    content: Math.round(contentScore),
    bestPractices: Math.round(bestPracticesScore)
  };

  // Weighted overall calculation
  const overallScore = Math.round(
    categoryScores.technical * 0.20 +
      categoryScores.onPage * 0.25 +
      categoryScores.performance * 0.20 +
      categoryScores.accessibility * 0.15 +
      categoryScores.content * 0.10 +
      categoryScores.bestPractices * 0.10
  );

  // Ensure overall score strictly adheres to 0-100 range
  const finalScore = Math.min(100, Math.max(0, overallScore));

  // Add positive indicators for good findings
  if (seoData.isHttps) {
    issues.push({
      title: 'HTTPS Connection Enforced',
      description: 'Your website uses a secure SSL/TLS connection.',
      category: 'Technical',
      severity: 'Good',
      recommendation: 'Maintain SSL certificates before expiration.'
    });
  }
  if (seoData.title && seoData.titleLength >= 30 && seoData.titleLength <= 60) {
    issues.push({
      title: 'Optimal Title Tag Length',
      description: `Title tag length is ${seoData.titleLength} characters, which is ideal.`,
      category: 'On-Page',
      severity: 'Good',
      recommendation: 'Keep updating title tag as keywords evolve.'
    });
  }
  if (seoData.viewport) {
    issues.push({
      title: 'Mobile Friendly Viewport Configured',
      description: 'Viewport tag is present and configured for responsive displays.',
      category: 'Accessibility',
      severity: 'Good',
      recommendation: 'Ensure touch targets and font sizes remain comfortable on mobile.'
    });
  }

  // Populate general recommendations
  recommendations.push(
    {
      title: 'Optimize Title Tag & Meta Description',
      description: 'Ensure main keywords are placed near the beginning of title and meta description tags.',
      category: 'On-Page',
      impact: 'High'
    },
    {
      title: 'Improve Image ALT Coverage',
      description: 'Provide concise descriptive ALT tags for all site images.',
      category: 'Accessibility',
      impact: 'Medium'
    },
    {
      title: 'Enhance Page Speed & Caching',
      description: 'Minify CSS/JS bundles and enable server-level browser caching.',
      category: 'Performance',
      impact: 'High'
    }
  );

  return {
    score: finalScore,
    categoryScores,
    issues,
    recommendations
  };
}

module.exports = {
  calculateSeoScore
};
