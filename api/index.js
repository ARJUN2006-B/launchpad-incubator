// api/index.js — Vercel Serverless Function entry point
let app;
let startupError = null;

try {
  app = require('../server');
} catch (err) {
  console.error('CRITICAL: Failed to load server in Vercel function:', err);
  startupError = err;
}

module.exports = (req, res) => {
  if (startupError) {
    return res.status(500).json({
      error: 'Server startup failed on Vercel',
      message: startupError.message,
      stack: startupError.stack
    });
  }
  return app(req, res);
};
