const express = require('express');
const cors = require('cors');
const analysisRoutes = require('./routes/analysis.routes');
const areasRoutes = require('./routes/areas.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// User requested: app.use("/api", analysisRoutes); which contains .post("/analyze")
// This results in /api/analyze
app.use('/api', analysisRoutes);
app.use('/api/areas', areasRoutes);

// Health check
app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Aravalli Intelligence Platform Backend' });
});

module.exports = app;
