import crypto from 'crypto';
import { UAParser } from 'ua-parser-js';

export function anonymizeIp(ip: string): string {
  // Hash the IP address for privacy
//   return crypto
//     .createHash('sha256')
//     .update(ip + process.env.IP_SALT) // Add a salt for security
//     .digest('hex');
return ip;
}

export function parseUserAgent(userAgent: string) {
  const parser = new UAParser(userAgent);
  const device = parser.getDevice();
  const browser = parser.getBrowser();

  return {
    device: `${device.vendor || ''} ${device.model || ''} ${device.type || ''}`.trim() || 'Unknown',
    browser: `${browser.name || ''} ${browser.version || ''}`.trim() || 'Unknown'
  };
}

export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function getGeoLocation(ip: string) {
  try {
    const response = await fetch(
      `https://ipapi.co/${ip}/json/`
    );
    const data = await response.json();
    
    return {
      country: data.country_name,
      city: data.city
    };
  } catch (error) {
    console.error('Error fetching geolocation:', error);
    return { country: null, city: null };
  }
} 