const net = require('net');

/**
 * Checks whether an IP address belongs to a private, loopback, or cloud metadata network.
 * Used for SSRF (Server-Side Request Forgery) protection.
 * 
 * @param {string} ip - IP address string to test
 * @returns {boolean} True if the IP is private/unsafe, false if safe
 */
function isPrivateIp(ip) {
  // Loopback & Unspecified
  if (ip === '127.0.0.1' || ip === '::1' || ip === '0.0.0.0' || ip === '::') {
    return true;
  }

  // Handle IPv4 mapped IPv6 addresses
  if (ip.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '');
  }

  // IPv4 range checks
  const parts = ip.split('.').map(Number);
  if (parts.length === 4 && parts.every((p) => !isNaN(p) && p >= 0 && p <= 255)) {
    // 10.0.0.0 - 10.255.255.255 (Private)
    if (parts[0] === 10) return true;

    // 172.16.0.0 - 172.31.255.255 (Private)
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;

    // 192.168.0.0 - 192.168.255.255 (Private)
    if (parts[0] === 192 && parts[1] === 168) return true;

    // 169.254.0.0 - 169.254.255.255 (Link-Local / AWS/GCP Metadata Service)
    if (parts[0] === 169 && parts[1] === 254) return true;

    // 127.0.0.0 - 127.255.255.255 (Loopback)
    if (parts[0] === 0 || parts[0] === 127) return true;
  }

  return false;
}

/**
 * Validates a user-provided URL against SSRF attacks and security risks.
 * 
 * @param {string} inputUrl - URL string entered by user
 * @returns {Object} { isValid: boolean, error?: string, parsedUrl?: URL }
 */
function validateUrlForSsrf(inputUrl) {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return { isValid: false, error: 'URL is required and must be a string.' };
  }

  let formattedUrl = inputUrl.trim();

  // If no scheme is specified (no "://"), prepend https://
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(formattedUrl)) {
    if (formattedUrl.startsWith('javascript:')) {
      return { isValid: false, error: 'Prohibited JavaScript URI scheme.' };
    }
    formattedUrl = 'https://' + formattedUrl;
  }

  try {
    const parsed = new URL(formattedUrl);

    // Protocol check: Only http and https permitted
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, error: 'Only HTTP and HTTPS protocols are supported.' };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Reject localhost explicitly
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal')
    ) {
      return { isValid: false, error: 'Access to localhost and internal domain names is prohibited.' };
    }

    // Direct IP format check
    if (net.isIP(hostname)) {
      if (isPrivateIp(hostname)) {
        return { isValid: false, error: 'Access to private, loopback, or metadata IP ranges is prohibited.' };
      }
    }

    return {
      isValid: true,
      parsedUrl: parsed,
      normalizedUrl: parsed.href
    };
  } catch (err) {
    return { isValid: false, error: 'Invalid URL format provided.' };
  }
}

module.exports = {
  isPrivateIp,
  validateUrlForSsrf
};
