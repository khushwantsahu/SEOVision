const { validateUrlForSsrf } = require('../utils/ssrfFilter');

/**
 * Express middleware to validate incoming request body URL for SSRF protection.
 */
const validateUrlMiddleware = (req, res, next) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({
      success: false,
      message: 'Website URL is required'
    });
  }

  const result = validateUrlForSsrf(url);

  if (!result.isValid) {
    return res.status(400).json({
      success: false,
      message: result.error || 'Invalid or prohibited URL'
    });
  }

  // Attach normalized URL and parsed object to req for downstream use
  req.normalizedUrl = result.normalizedUrl;
  req.parsedUrl = result.parsedUrl;
  next();
};

module.exports = validateUrlMiddleware;
