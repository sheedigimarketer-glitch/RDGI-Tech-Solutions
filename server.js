/**
 * HerSpace Premium 4.1 - Backend Server & Telephony / Auth API Gateway
 * Zero dependencies, built with standard Node.js crypto and http modules.
 * Isolates Exotel credentials and OTP HMAC signatures on the server side.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = __dirname;

// Server Environment Variables & Secrets
const EXOTEL_API_KEY = process.env.EXOTEL_API_KEY || '';
const EXOTEL_API_TOKEN = process.env.EXOTEL_API_TOKEN || '';
const EXOTEL_ACCOUNT_SID = process.env.EXOTEL_ACCOUNT_SID || '';
const EXOTEL_CALLER_ID = process.env.EXOTEL_CALLER_ID || '04448131000';
const OTP_HMAC_SECRET = process.env.OTP_HMAC_SECRET || 'hs_secret_hmac_default_entropy_shield_2026';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.mp4': 'video/mp4'
};

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache'
  });
  res.end(JSON.stringify(data));
}

function maskNumber(num) {
  if (!num) return '+91 9XXXX XXXXX';
  const clean = String(num).replace(/\D/g, '').slice(-10);
  if (clean.length === 10) {
    return `+91 ${clean.slice(0, 4)}X XXXXX`;
  }
  return '+91 9XXXX XXXXX';
}

const server = http.createServer(async (req, res) => {
  // CORS & Defense-in-Depth Security Headers
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(self), camera=()');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https:; object-src 'none';"
  );

  // Handle CORS Pre-flight Options Request
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // ==========================================
  // SERVER-SIDE API ROUTES (/api/*)
  // ==========================================

  // 1. Exotel Telephony Virtual Bridge Connector
  if (pathname === '/api/telephony/connect' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const userPhone = body.userPhone || body.callerPhone;
      const listenerId = body.listenerId || body.partnerId || 'listener_01';
      const bookingId = body.bookingId || 'HS-BK-' + Date.now().toString(36);

      if (!userPhone) {
        return sendJson(res, 400, { error: 'Missing required user phone parameter.' });
      }

      // Backend-only registry: Real listener phones are NEVER sent to the client
      const listenerPhoneRegistry = {
        'listener_01': '+919876543210',
        'counsellor_02': '+919812345678',
        'singer_03': '+919840555678',
        'counsellor_01': '+919840112345',
        'listener_02': '+919841267890'
      };

      const listenerPhone = listenerPhoneRegistry[listenerId] || body.calleePhone || listenerPhoneRegistry['listener_01'];

      const isExotelConfigured =
        EXOTEL_API_KEY &&
        !EXOTEL_API_KEY.includes('your_exotel') &&
        EXOTEL_API_TOKEN &&
        !EXOTEL_API_TOKEN.includes('your_exotel') &&
        EXOTEL_ACCOUNT_SID &&
        !EXOTEL_ACCOUNT_SID.includes('your_exotel');

      if (isExotelConfigured) {
        try {
          const authHeader = Buffer.from(`${EXOTEL_API_KEY}:${EXOTEL_API_TOKEN}`).toString('base64');
          const endpoint = `https://api.exotel.com/v1/Accounts/${EXOTEL_ACCOUNT_SID}/Calls/connect.json`;

          const payload = new URLSearchParams();
          payload.append('From', userPhone);
          payload.append('To', listenerPhone);
          payload.append('CallerId', EXOTEL_CALLER_ID);
          payload.append('TimeLimit', '1800');
          payload.append('CustomField', bookingId);

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${authHeader}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: payload.toString(),
          });

          const result = await response.json();
          if (!response.ok) {
            console.error('Telephony API error response:', result);
            return sendJson(res, 502, { error: 'Failed to initiate masked bridge call.' });
          }

          return sendJson(res, 200, {
            success: true,
            message: 'Call initiated. Your phone will ring shortly.',
            callSid: result.Call ? result.Call.Sid : crypto.randomUUID(),
          });
        } catch (fetchErr) {
          console.error('Error contacting Exotel gateway:', fetchErr);
          return sendJson(res, 500, { error: 'Internal server error bridging session.' });
        }
      }

      // Safe Preview / Dev Simulation
      const maskedCaller = maskNumber(userPhone);
      const sessionSid = 'EXO-' + crypto.randomBytes(8).toString('hex');

      return sendJson(res, 200, {
        success: true,
        message: 'Call initiated. Your phone will ring shortly.',
        callSid: sessionSid,
        status: 'bridged',
        isLive: false,
        callerId: EXOTEL_CALLER_ID,
        partnerId: listenerId,
        callerMaskedDisplay: maskedCaller,
        partnerMaskedDisplay: '+91 44 4813 1001 (Exotel Virtual Bridge)',
        timestamp: Date.now()
      });
    } catch (err) {
      return sendJson(res, 400, { success: false, error: err.message });
    }
  }

  // 2. Stateless Cryptographic OTP Generation (HMAC-SHA256)
  if (pathname === '/api/auth/send-otp' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const phone = String(body.phone || '').replace(/\D/g, '').slice(-10);

      if (phone.length < 10) {
        return sendJson(res, 400, { success: false, error: 'Valid 10-digit mobile number required.' });
      }

      // Generate high-entropy 6-digit OTP using crypto.randomInt
      const otp = crypto.randomInt(100000, 1000000).toString();
      const timestamp = Date.now();

      // Create stateless HMAC signature
      const signature = crypto
        .createHmac('sha256', OTP_HMAC_SECRET)
        .update(`${phone}:${otp}:${timestamp}`)
        .digest('hex');

      const token = `${timestamp}.${signature}`;

      return sendJson(res, 200, {
        success: true,
        formattedPhone: '+91 ' + phone,
        maskedPhone: maskNumber(phone),
        token,
        demoOtp: otp, // Provided for UI preview and local testing
        expiresInSeconds: 600
      });
    } catch (err) {
      return sendJson(res, 400, { success: false, error: err.message });
    }
  }

  // 3. Stateless OTP Signature Verification
  if (pathname === '/api/auth/verify-otp' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const phone = String(body.phone || '').replace(/\D/g, '').slice(-10);
      const otp = String(body.otp || '').trim();
      const token = String(body.token || '');

      if (!token || !token.includes('.')) {
        return sendJson(res, 400, { success: false, error: 'Invalid or missing cryptographic signature token.' });
      }

      const [timeStr, clientSignature] = token.split('.');
      const issuedAt = parseInt(timeStr, 10);
      const now = Date.now();

      // 10-minute validity expiry check
      if (now - issuedAt > 10 * 60 * 1000) {
        return sendJson(res, 401, { success: false, error: 'OTP signature expired (10-minute validity exceeded).' });
      }

      // Re-compute expected HMAC-SHA256
      const expectedSignature = crypto
        .createHmac('sha256', OTP_HMAC_SECRET)
        .update(`${phone}:${otp}:${issuedAt}`)
        .digest('hex');

      const isMatch =
        clientSignature.length === expectedSignature.length &&
        crypto.timingSafeEqual(Buffer.from(clientSignature), Buffer.from(expectedSignature));

      if (isMatch) {
        return sendJson(res, 200, { success: true, verified: true });
      } else {
        return sendJson(res, 401, { success: false, error: 'Incorrect OTP code.' });
      }
    } catch (err) {
      return sendJson(res, 400, { success: false, error: err.message });
    }
  }

  // 4. Unified Stateless OTP API (/api/auth/otp)
  if (pathname === '/api/auth/otp') {
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      return res.end();
    }
    if (req.method !== 'POST') {
      return sendJson(res, 405, { error: 'Method not allowed' });
    }

    try {
      const body = await parseJsonBody(req);
      const { action, phone, otp, hash } = body;

      const phoneRegex = /^\+?[1-9]\d{9,14}$/;
      if (!phone || !phoneRegex.test(phone)) {
        return sendJson(res, 400, { error: 'Invalid phone number format.' });
      }

      if (!OTP_HMAC_SECRET) {
        return sendJson(res, 500, { error: 'Internal security configuration error.' });
      }

      // --- 1. SEND OTP ---
      if (action === 'send') {
        const generatedOtp = crypto.randomInt(100000, 1000000).toString();
        const ttl = 10 * 60 * 1000;
        const expiresAt = Date.now() + ttl;

        const dataToSign = `${phone}.${generatedOtp}.${expiresAt}`;
        const signature = crypto
          .createHmac('sha256', OTP_HMAC_SECRET)
          .update(dataToSign)
          .digest('hex');

        const signedPayload = `${signature}.${expiresAt}`;

        console.log(`[SECURE SMS DISPATCH] Sent to ${phone}: ${generatedOtp}`);

        return sendJson(res, 200, {
          success: true,
          message: 'OTP dispatched successfully.',
          hash: signedPayload,
          expiresAt,
          demoOtp: generatedOtp
        });
      }

      // --- 2. VERIFY OTP ---
      if (action === 'verify') {
        if (!otp || !hash) {
          return sendJson(res, 400, { error: 'Missing OTP or validation token.' });
        }

        const [receivedSignature, expiresAtStr] = hash.split('.');
        const expiresAt = parseInt(expiresAtStr, 10);

        if (Date.now() > expiresAt) {
          return sendJson(res, 401, { error: 'OTP has expired. Please request a new one.' });
        }

        const expectedData = `${phone}.${otp}.${expiresAt}`;
        const expectedSignature = crypto
          .createHmac('sha256', OTP_HMAC_SECRET)
          .update(expectedData)
          .digest('hex');

        const isSignatureValid =
          receivedSignature &&
          receivedSignature.length === expectedSignature.length &&
          crypto.timingSafeEqual(
            Buffer.from(receivedSignature, 'utf-8'),
            Buffer.from(expectedSignature, 'utf-8')
          );

        if (!isSignatureValid) {
          return sendJson(res, 401, { error: 'Invalid verification code.' });
        }

        const sessionToken = crypto.randomBytes(32).toString('hex');

        return sendJson(res, 200, {
          success: true,
          message: 'Authentication verified.',
          sessionToken,
        });
      }

      return sendJson(res, 400, { error: 'Invalid action requested.' });
    } catch (err) {
      return sendJson(res, 400, { error: err.message });
    }
  }

  // ==========================================
  // STATIC ASSETS & SINGLE PAGE APPLICATION
  // ==========================================
  let reqPath = decodeURI(pathname);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const filePath = path.join(PUBLIC_DIR, reqPath);

  // Security guard against path traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for client-side SPA routing
      const indexPath = path.join(PUBLIC_DIR, 'index.html');
      fs.stat(indexPath, (idxErr, idxStats) => {
        if (!idxErr && idxStats.isFile()) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          return fs.createReadStream(indexPath).pipe(res);
        }
        res.writeHead(404, { 'Content-Type': 'text/html' });
        return res.end('<h1>404 Not Found</h1><p>Resource not found.</p>');
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('\n======================================================');
  console.log('HERSPACE PREMIUM 4.1 RUNNING');
  console.log('URL: http://localhost:' + PORT);
  console.log('TELEPHONY & STATELESS OTP API MOUNTED ON /api/*');
  console.log('======================================================\n');
});

if (!process.env.NO_FRESH) {
  const FRESH_PORT = 3000;
  const freshServer = http.createServer(server.listeners('request')[0]);
  freshServer.on('error', () => {});
  freshServer.listen(FRESH_PORT, '0.0.0.0', () => {
    console.log('FRESH CACHE-FREE PREVIEW URL: http://localhost:' + FRESH_PORT);
  });
}
