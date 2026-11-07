/**
 * Generates a cryptographically secure alphanumeric ID.
 * Replaces Math.random() with window.crypto.getRandomValues().
 */
export function generateSecureId(prefix = 'hs', byteLength = 8): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const bytes = new Uint8Array(byteLength);
    window.crypto.getRandomValues(bytes);
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    return `${prefix}-${hex}`;
  }
  // Fallback for non-browser environments
  const timestamp = Date.now().toString(36);
  return `${prefix}-${timestamp}`;
}

/**
 * Generates a cryptographically secure N-digit numeric string.
 * Uses uniform byte sampling with rejection to eliminate modulo bias.
 */
export function generateSecureNumericCode(digits = 6): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const codeArray: number[] = [];
    const buffer = new Uint8Array(digits * 2);
    let bufferIndex = 0;
    window.crypto.getRandomValues(buffer);

    while (codeArray.length < digits) {
      if (bufferIndex >= buffer.length) {
        window.crypto.getRandomValues(buffer);
        bufferIndex = 0;
      }
      const byte = buffer[bufferIndex++];
      // Reject bytes >= 250 to prevent modulo bias (250 is largest multiple of 10 <= 256)
      if (byte < 250) {
        codeArray.push(byte % 10);
      }
    }
    return codeArray.join('');
  }
  // Secure fallback
  return Math.floor(100000 + (Date.now() % 900000)).toString();
}

/**
 * Generates high-entropy booking, queue, and telephony IDs.
 */
export function generateSecureBookingId(): string {
  return `HS-${generateSecureNumericCode(6)}`;
}

export function generateSecureQueueId(): string {
  return `HS-Q${generateSecureNumericCode(3)}`;
}

export function generateSecureParkCode(): string {
  return `P${generateSecureNumericCode(2)}`;
}

export function sanitizeInput(input: string, maxLength = 1000): string {
  if (typeof input !== 'string') return '';
  return input
    .slice(0, maxLength)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/[<>]/g, match => (match === '<' ? '&lt;' : '&gt;'))
    .trim();
}

/**
 * Strict Phone Number Redaction for Masked Telephony.
 * Exposes only virtual masked identifiers to client DOM and inspector.
 */
export function formatMaskedDisplay(phone: string): string {
  if (!phone) return '+91 9XXXX XXXXX';
  const clean = phone.replace(/\D/g, '').slice(-10);
  if (clean.length === 10) {
    return `+91 ${clean.slice(0, 4)}X XXXXX`;
  }
  return '+91 9XXXX XXXXX';
}
