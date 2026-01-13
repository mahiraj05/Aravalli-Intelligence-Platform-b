const { bucket } = require('../config/firebase');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

const uploadGeoJSON = async (geoJSONData, folder = 'analysis_results') => {
    try {
        const filename = `${folder}/${uuidv4()}.geojson`;
        const file = bucket.file(filename);
        const jsonString = JSON.stringify(geoJSONData);

        await file.save(jsonString, {
            metadata: {
                contentType: 'application/geo+json',
            },
        });

        // Make the file public (optional, depending on security requirements. 
        // For MVP, signed URLs or making it public is easiest for frontend to fetch).
        // Note: 'makePublic' requires appropriate IAM permissions. 
        // Alternatively, we get a signed URL.

        // For this MVP, we'll try to get a Signed URL valid for a long time 
        // OR just return the path if the frontend uses Firebase SDK to fetch.
        // Let's assume Signed URL for now as it's generic.
        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '03-01-2500', // Far future
        });

        logger.info(`Uploaded GeoJSON to ${filename}`);
        return url;
    } catch (error) {
        logger.error('Error uploading to Storage:', error);
        throw error;
    }
};

module.exports = { uploadGeoJSON };
