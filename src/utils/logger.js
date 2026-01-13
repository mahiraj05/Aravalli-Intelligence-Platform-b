const logger = {
    info: (message, meta) => {
        const timestamp = new Date().toISOString();
        console.log(`[INFO] ${timestamp}: ${message}`, meta ? JSON.stringify(meta) : '');
    },
    error: (message, error) => {
        const timestamp = new Date().toISOString();
        console.error(`[ERROR] ${timestamp}: ${message}`, error);
    },
    warn: (message, meta) => {
        const timestamp = new Date().toISOString();
        console.warn(`[WARN] ${timestamp}: ${message}`, meta ? JSON.stringify(meta) : '');
    }
};

module.exports = logger;
