const fs = require('fs');
const path = require('path');
const logger = require('./logger');

/**
 * Loads a GeoJSON file from the local file system
 * @param {string} filePath - Absolute or relative path to the file
 * @returns {object} Parsed GeoJSON object
 */
const loadGeoJSON = (filePath) => {
    try {
        const absolutePath = path.resolve(filePath);
        if (!fs.existsSync(absolutePath)) {
            throw new Error(`File not found: ${absolutePath}`);
        }
        const rawData = fs.readFileSync(absolutePath, 'utf8');
        return JSON.parse(rawData);
    } catch (error) {
        logger.error(`Failed to load GeoJSON from ${filePath}`, error);
        throw error;
    }
};

module.exports = { loadGeoJSON };
