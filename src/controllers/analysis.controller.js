const { runMockAnalysis } = require('../services/analysis.service');

exports.triggerAnalysis = async (req, res) => {
    try {
        console.log('Received POST /api/analyze request');
        const result = await runMockAnalysis();

        return res.status(200).json({
            message: "Analysis completed successfully",
            analysisId: result.id,
            data: result // Returning full data to help frontend visualization
        });
    } catch (error) {
        console.error("POST /api/analyze CRITICAL FAILURE:", error);

        return res.status(500).json({
            message: "Analysis failed",
            error: error.message,
            // Only show stack in development for security
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
