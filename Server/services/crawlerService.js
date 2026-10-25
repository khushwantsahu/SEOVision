const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');

/**
 * Fetches HTML from target URL and extracts comprehensive SEO metrics.
 * Safe HTTP client configured with timeouts and custom user-agent.
 * 
 * @param {string} targetUrl - Validated target website URL
 * @returns {Promise<Object>} Extracted SEO data and metrics
 */
async function crawlWebsite(targetUrl) {
  const startTime = Date.now();
  const parsedUrl = new URL(targetUrl);
  const domain = parsedUrl.hostname;
  const isHttps = parsedUrl.protocol === 'https:';

  try {
    // 1. Fetch main HTML page
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SEOVisionBot/1.0 (+https://seovision.local/bot)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      timeout: 12000, // 12-second request timeout
      maxRedirects: 5,
      validateStatus: (status) => status < 500 // Accept redirects and standard response status codes
    });

    const responseTimeMs = Date.now() - startTime;
    const html = response.data || '';
    const htmlSizeBytes = typeof html === 'string' ? Buffer.byteLength(html, 'utf8') : 0;

    // 2. Parse HTML structure with Cheerio
    const $ = cheerio.load(html);

    // Extract Title Tag
    const title = $('title').first().text().trim() || '';
    const titleLength = title.length;

    // Extract Meta Description
    const metaDescription =
      $('meta[name="description"i]').attr('content') ||
      $('meta[property="og:description"i]').attr('content') ||
      '';
    const descriptionLength = metaDescription.trim().length;

    // Extract Meta Canonical & Robots
    const canonicalUrl = $('link[rel="canonical"i]').attr('href') || '';
    const robotsMeta = $('meta[name="robots"i]').attr('content') || '';

    // Extract Viewport & HTML Lang
    const viewport = $('meta[name="viewport"i]').length > 0;
    const htmlLang = $('html').attr('lang') || '';

    // Extract Headings Hierarchy
    const h1List = [];
    $('h1').each((_, el) => {
      const text = $(el).text().trim();
      if (text) h1List.push(text.slice(0, 100));
    });
    const h1Count = $('h1').length;
    const h2Count = $('h2').length;
    const h3Count = $('h3').length;

    // Extract Image Data
    let totalImages = 0;
    let missingAltCount = 0;
    $('img').each((_, el) => {
      totalImages++;
      const alt = $(el).attr('alt');
      if (alt === undefined || alt.trim() === '') {
        missingAltCount++;
      }
    });

    const altCoverage =
      totalImages > 0
        ? Math.round(((totalImages - missingAltCount) / totalImages) * 100)
        : 100;

    // Extract Links (Internal vs External)
    let internalLinks = 0;
    let externalLinks = 0;

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

      try {
        const linkUrl = new URL(href, targetUrl);
        if (linkUrl.hostname === domain || linkUrl.hostname.endsWith(`.${domain}`)) {
          internalLinks++;
        } else {
          externalLinks++;
        }
      } catch (err) {
        // Ignore invalid href formats like mailto: or tel:
      }
    });

    // Detect Structured Data (JSON-LD)
    let structuredDataFound = false;
    $('script[type="application/ld+json"]').each((_, el) => {
      if ($(el).html() && $(el).html().trim().length > 0) {
        structuredDataFound = true;
      }
    });

    // Count Page Assets
    const scriptCount = $('script[src]').length;
    const styleCount = $('link[rel="stylesheet"]').length;

    // 3. Check for robots.txt and sitemap.xml in background
    const [hasRobotsTxt, hasSitemap] = await Promise.all([
      checkResourceExists(`${parsedUrl.protocol}//${domain}/robots.txt`),
      checkResourceExists(`${parsedUrl.protocol}//${domain}/sitemap.xml`)
    ]);

    // 4. Extract Top Keywords & Frequencies from Text
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    const keywords = extractKeywordFrequencies(bodyText);

    return {
      domain,
      isHttps,
      title,
      titleLength,
      metaDescription,
      descriptionLength,
      canonicalUrl,
      robotsMeta,
      hasRobotsTxt,
      hasSitemap,
      viewport,
      htmlLang,
      headings: {
        h1Count,
        h2Count,
        h3Count,
        h1List: h1List.slice(0, 5)
      },
      images: {
        total: totalImages,
        missingAlt: missingAltCount,
        altCoverage
      },
      links: {
        internal: internalLinks,
        external: externalLinks,
        total: internalLinks + externalLinks
      },
      performanceMetrics: {
        responseTimeMs,
        htmlSizeBytes,
        resourceCounts: {
          images: totalImages,
          scripts: scriptCount,
          styles: styleCount
        }
      },
      structuredDataFound,
      keywords
    };
  } catch (error) {
    console.error(`[Crawler Error] Failed to crawl ${targetUrl}:`, error.message);
    throw new Error(`Failed to crawl website: ${error.message}`);
  }
}

/**
 * Checks if a specific resource (e.g. robots.txt or sitemap.xml) exists via HTTP request.
 */
async function checkResourceExists(url) {
  try {
    const res = await axios.head(url, { timeout: 3000, validateStatus: (status) => status < 400 });
    return res.status >= 200 && res.status < 400;
  } catch (err) {
    try {
      const res = await axios.get(url, { timeout: 3000, validateStatus: (status) => status < 400 });
      return res.status >= 200 && res.status < 400;
    } catch (e) {
      return false;
    }
  }
}

/**
 * Helper function to extract keyword frequencies from page body text.
 */
function extractKeywordFrequencies(text) {
  if (!text) return [];

  const stopWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with',
    'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her',
    'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up',
    'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time',
    'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could',
    'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think',
    'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even',
    'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'is', 'are', 'was', 'were'
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.has(w));

  const totalWords = words.length || 1;
  const freqMap = {};

  for (const word of words) {
    freqMap[word] = (freqMap[word] || 0) + 1;
  }

  const sorted = Object.entries(freqMap)
    .map(([keyword, frequency]) => ({
      keyword,
      frequency,
      density: ((frequency / totalWords) * 100).toFixed(1) + '%'
    }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 8);

  return sorted;
}

module.exports = {
  crawlWebsite,
  checkResourceExists,
  extractKeywordFrequencies
};
