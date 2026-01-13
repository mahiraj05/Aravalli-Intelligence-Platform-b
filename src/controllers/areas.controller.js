const analysisService = require('../services/analysis.service');
const logger = require('../utils/logger');

exports.getAreas = async (req, res) => {
    try {
        logger.info('GET /api/areas request received');
        const filters = req.query;
        // Logic moved to service, controller just handles response
        const data = await analysisService.getHistory(filters);

        // Ensure data is always an array
        const safeData = Array.isArray(data) ? data : [];

        // FIX: Always return valid JSON, even if empty
        res.status(200).json({
            success: true,
            count: safeData.length,
            data: safeData
        });
    } catch (error) {
        logger.error('Areas controller error:', error);

        // FIX: Never crash silently, return 500 with JSON
        // Even if DB failed, we might want to return empty array instead of 500 if that's safer for frontend?
        // But prompt implies "Never return 500". 
        // Actually prompt says "/api/areas MUST: Never return 500".
        // Use a fallback empty array if hard error?
        // Let's return 200 with empty array but log the error, to meet "Never return 500" for dashboard stability.

        logger.error('Recovering from error by returning empty list to frontend.');
        res.status(200).json({
            success: false, // Indicate it wasn't a full success
            count: 0,
            data: [],
            message: 'Failed to fetch data, showing empty results.'
        });
    }
};
