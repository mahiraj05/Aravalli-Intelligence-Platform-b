const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysis.controller');

// Matches POST /api/analyze (when mounted at /api)
router.post('/analyze', analysisController.triggerAnalysis);

module.exports = router;
