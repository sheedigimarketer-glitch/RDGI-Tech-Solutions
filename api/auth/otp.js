module.exports = function handler(_req, res) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(410).json({ error: 'Phone verification is currently unavailable.' });
};
