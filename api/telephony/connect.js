module.exports = function handler(_req, res) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(503).json({ error: 'Masked calling is currently unavailable.' });
};
