const fs = require('fs');
const path = require('path');
// Import configured admin instance to ensure initialization
const { db, admin } = require('../config/firebase');
const logger = require('../utils/logger');

/**
 * FIXED: Safe mock analysis with inline GeoJSON
 * Replaces complex pipeline for MVP stability.
 */
const runMockAnalysis = async () => {
    try {
        // 1. Load mock GeoJSON safely
        // Use path.resolve for absolute path reliability
        const filePath = path.resolve(process.cwd(), 'src', 'data', 'mock_deforestation.geojson');

        logger.info(`Loading mock GeoJSON from: ${filePath}`);

        if (!fs.existsSync(filePath)) {
            const errorMsg = `Mock GeoJSON file not found at: ${filePath}`;
            logger.error(errorMsg);
            throw new Error(errorMsg);
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        let geojson;
        try {
            geojson = JSON.parse(fileContent);
        } catch (parseError) {
            const errorMsg = `Invalid JSON in mock file: ${parseError.message}`;
            logger.error(errorMsg);
            throw new Error(errorMsg);
        }

        // 2. Prepare analysis metadata
        const analysis = {
            type: 'deforestation',
            region: 'jaipur-aravalli',
            riskScore: 0.82,
            riskLevel: 'high',
            geojson, // store inline for immediate return
            source: 'mock',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            // Ensure summary exists
            summary: {
                areasDetected: geojson.features?.length || 0,
                totalAreaHa: 12.8,
                analyzedAt: new Date().toISOString()
            }
        };

        // 3. Save to Firestore (using 'analyses' collection as requested by user)
        // Wrapped in try/catch specifically for DB operations
        try {
            // FIX: Firestore does not support nested arrays (GeoJSON coordinates).
            // We must stringify the geojson for storage.
            const dbAnalysis = {
                ...analysis,
                geojson: JSON.stringify(geojson) // Store as string
            };

            const ref = await db.collection('analyses').add(dbAnalysis);
            logger.info(`Analysis saved with ID: ${ref.id}`);

            // Return result with ID and ORIGINAL object geojson (for frontend)
            return {
                id: ref.id,
                ...analysis,
                // Convert serverTimestamp to date for immediate frontend display if needed
                createdAt: new Date().toISOString()
            };
        } catch (dbError) {
            logger.error('Firestore save failed:', dbError);
            throw new Error(`Database error: ${dbError.message}`);
        }

    } catch (error) {
        logger.error('runMockAnalysis error:', error);
        throw error;
    }
};

/**
 * Fetch history from the new 'analyses' collection
 */
const getHistory = async (filters) => {
    try {
        logger.info('Fetching analysis history...');
        const query = db.collection('analyses').orderBy('createdAt', 'desc');
        const snapshot = await query.get();

        if (snapshot.empty) {
            logger.info('No analysis history found.');
            return [];
        }

        return snapshot.docs.map(doc => {
            const data = doc.data();
            // Handle Firestore timestamps safely
            const createdAt = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : data.createdAt;

            // Parse geojson string back to object if it's a string
            let geojson = data.geojson;
            if (typeof geojson === 'string') {
                try {
                    geojson = JSON.parse(geojson);
                } catch (e) {
                    logger.warn(`Failed to parse geojson for doc ${doc.id}`, e);
                    geojson = null;
                }
            }

            return {
                id: doc.id,
                ...data,
                geojson, // Return object
                createdAt
            };
        });
    } catch (error) {
        logger.error('getHistory error:', error);
        // Important: Return empty array so frontend doesn't crash, but log the error
        return [];
    }
};

module.exports = { runMockAnalysis, getHistory };
