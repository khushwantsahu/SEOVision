const rateLimit = require('express-rate-limit');

/**
 * Standard API rate limiter to prevent abuse and DDoS.
 * Limits each IP to 100 requests per 15 minutes.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

/**
 * Strict rate limiter for authentication routes (login/register).
 * Limits each IP to 5 attempts per 15 minutes to prevent brute-force attacks.
 * Successful logins are not counted against the limit.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes.'
  }
});

module.exports = { apiLimiter, authLimiter };
