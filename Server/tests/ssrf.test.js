const { validateUrlForSsrf, isPrivateIp } = require('../utils/ssrfFilter');

describe('SSRF Protection & URL Validation', () => {
  it('should identify loopback and private IP addresses correctly', () => {
    expect(isPrivateIp('127.0.0.1')).toBe(true);
    expect(isPrivateIp('::1')).toBe(true);
    expect(isPrivateIp('10.0.0.5')).toBe(true);
    expect(isPrivateIp('172.16.0.1')).toBe(true);
    expect(isPrivateIp('192.168.1.100')).toBe(true);
    expect(isPrivateIp('169.254.169.254')).toBe(true); // AWS Metadata endpoint
    expect(isPrivateIp('8.8.8.8')).toBe(false); // Public DNS
    expect(isPrivateIp('142.250.190.46')).toBe(false); // Public Google IP
  });

  it('should block localhost and internal domain URLs', () => {
    expect(validateUrlForSsrf('http://localhost:5000').isValid).toBe(false);
    expect(validateUrlForSsrf('http://127.0.0.1/admin').isValid).toBe(false);
    expect(validateUrlForSsrf('http://169.254.169.254/latest/meta-data/').isValid).toBe(false);
    expect(validateUrlForSsrf('http://app.internal').isValid).toBe(false);
  });

  it('should allow valid public HTTP/HTTPS URLs', () => {
    const res1 = validateUrlForSsrf('https://example.com');
    expect(res1.isValid).toBe(true);
    expect(res1.normalizedUrl).toBe('https://example.com/');

    const res2 = validateUrlForSsrf('github.com');
    expect(res2.isValid).toBe(true);
    expect(res2.normalizedUrl).toBe('https://github.com/');
  });

  it('should reject non-HTTP/HTTPS protocols', () => {
    expect(validateUrlForSsrf('ftp://files.example.com').isValid).toBe(false);
    expect(validateUrlForSsrf('file:///C:/Windows/System32').isValid).toBe(false);
    expect(validateUrlForSsrf('javascript:alert(1)').isValid).toBe(false);
  });
});
