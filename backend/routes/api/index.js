// backend/routes/api/index.js
const router = require('express').Router();

// Test route that accepts POST requests and returns the request body as JSON
router.post('/test', function(req, res) {
  res.json({ requestBody: req.body });
});

module.exports = router;

         