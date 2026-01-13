const express = require('express');
const router = express.Router();
const areasController = require('../controllers/areas.controller');

// GET /api/areas
router.get('/', areasController.getAreas);

module.exports = router;
