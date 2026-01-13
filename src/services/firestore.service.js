const { db } = require('../config/firebase');
const logger = require('../utils/logger');

const COLLECTION_NAME = 'analysis_results';

/**
 * Save analysis result metadata to Firestore
 */
const saveAnalysisResult = async (data) => {
    try {
        const docRef = await db.collection(COLLECTION_NAME).add({
            ...data,
            createdAt: new Date(), // Server timestamp alternatively
        });
        logger.info(`Saved analysis result with ID: ${docRef.id}`);
        return { id: docRef.id, ...data };
    } catch (error) {
        logger.error('Error saving to Firestore:', error);
        throw error;
    }
};

/**
 * Retrieve all analysis results with optional filters
 * Safe method: Always returns an array, never throws to the caller (logs instead)
 * @param {Object} filters - e.g., { type: 'deforestation', minRisk: 50 }
 * @returns {Promise<Array>} List of analysis results
 */
const getAllAnalyses = async (filters = {}) => {
    try {
        // Safety check for db connection
        if (!db) {
            logger.error('Firestore DB instance is undefined');
            return [];
        }

        const collectionRef = db.collection(COLLECTION_NAME);

        let query = collectionRef;

        if (filters.type) {
            query = query.where('type', '==', filters.type);
        }

        if (filters.minRisk) {
            // Ensure minRisk is a number to prevent Firestore type errors
            const minRiskVal = Number(filters.minRisk);
            if (!isNaN(minRiskVal)) {
                query = query.where('riskScore', '>=', minRiskVal);
            }
        }

        const snapshot = await query.orderBy('createdAt', 'desc').get();

        if (snapshot.empty) {
            return [];
        }

        const results = [];
        snapshot.forEach(doc => {
            results.push({ id: doc.id, ...doc.data() });
        });

        return results;
    } catch (error) {
        // Log the error internally but return empty array to prevent crash
        logger.error('CRITICAL: Error fetching analyses from Firestore:', error);

        // Return empty array to keep backend alive
        return [];
    }
};

module.exports = { saveAnalysisResult, getAllAnalyses };
