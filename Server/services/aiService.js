const axios = require('axios');

/**
 * AI Recommendation Service
 * Uses Google Gemini API (or configurable model) to generate custom AI recommendations
 * based on actual crawled SEO data. Provides robust fallback when AI key is absent.
 * 
 * @param {Object} seoData - Extracted technical SEO data
 * @param {Object} scoringResult - Calculated scores and issue list
 * @returns {Promise<Object>} AI Insights object with summary, suggestions, and tips
 */
async function generateAiRecommendations(seoData, scoringResult) {
  const apiKey = process.env.AI_API_KEY;
  const domain = seoData.domain || 'the website';

  // Fallback AI output when no API key is configured or during service outages
  const fallbackInsights = {
    summary: `SEO analysis for ${domain} reveals an overall score of ${scoringResult.score}/100. Key areas requiring attention include ${
      scoringResult.categoryScores.onPage < 80 ? 'On-Page meta tags' : 'technical performance'
    } and heading hierarchy.`,
    suggestedTitle: seoData.title
      ? `${seoData.title.split('-')[0].trim()} - Official Site | ${domain}`
      : `Welcome to ${domain} | Leading Solutions & Insights`,
    suggestedMetaDescription: seoData.metaDescription
      ? `Discover ${domain}'s top services, resources, and expert solutions. Visit us today to learn more.`
      : `Explore official resources and features at ${domain}. Get expert support and tailored solutions today.`,
    actionableSteps: [
      `Fix ${seoData.images.missingAlt || 0} missing image ALT tags to improve image search indexing.`,
      seoData.isHttps ? 'Maintain SSL/TLS certificate configuration.' : 'Enforce HTTPS connection across all domain pages.',
      'Optimize main title and meta description to target primary industry keywords.'
    ],
    contentTips: [
      'Structure content into logical H2 and H3 subheadings for better readability.',
      'Increase internal links pointing to high-priority landing pages.',
      'Regularly publish fresh, relevant content to build domain authority.'
    ]
  };

  if (!apiKey || apiKey.trim() === '') {
    console.log('[AI Service] AI_API_KEY not configured. Using deterministic fallback insights.');
    return fallbackInsights;
  }

  try {
    const model = process.env.AI_MODEL || 'gemini-1.5-flash';
    const prompt = `You are an expert SEO consultant. Analyze the following actual website audit data and provide structured SEO recommendations in JSON format.

Website Domain: ${domain}
Overall Score: ${scoringResult.score}/100
Technical Score: ${scoringResult.categoryScores.technical}/100
On-Page Score: ${scoringResult.categoryScores.onPage}/100
Current Title: "${seoData.title || ''}"
Current Meta Description: "${seoData.metaDescription || ''}"
Missing Alt Images: ${seoData.images.missingAlt || 0}
HTTPS Enabled: ${seoData.isHttps}

Respond ONLY with valid JSON in this structure:
{
  "summary": "2-3 sentence overview of site strengths and main vulnerabilities",
  "suggestedTitle": "An optimized title tag (30-60 chars)",
  "suggestedMetaDescription": "An optimized meta description (120-160 chars)",
  "actionableSteps": ["Step 1", "Step 2", "Step 3"],
  "contentTips": ["Tip 1", "Tip 2"]
}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      },
      { timeout: 8000 }
    );

    const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanJson = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      summary: parsed.summary || fallbackInsights.summary,
      suggestedTitle: parsed.suggestedTitle || fallbackInsights.suggestedTitle,
      suggestedMetaDescription: parsed.suggestedMetaDescription || fallbackInsights.suggestedMetaDescription,
      actionableSteps: parsed.actionableSteps || fallbackInsights.actionableSteps,
      contentTips: parsed.contentTips || fallbackInsights.contentTips
    };
  } catch (error) {
    console.warn('[AI Service Warning] Gemini API call failed, using fallback:', error.message);
    return fallbackInsights;
  }
}

module.exports = {
  generateAiRecommendations
};
