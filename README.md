# Aravalli Intelligence Platform - Backend

This is the Node.js/Express backend for the Aravalli Intelligence Platform. It handles data processing, storage, and API access for environmental analysis results (Mock Deforestation/Mining risk).

## 🏗 Architecture
- **Framework**: Express.js
- **Database**: Firebase Firestore (Metadata storage)
- **Object Storage**: Firebase Storage (GeoJSON files)
- **Analysis Engine**: Currently uses **Mock Logic** via `src/services/analysis.service.js`.
  - *Future Plan*: Integrate Google Earth Engine (GEE) via the Node.js client.

## 📂 Folder Structure
```
backend/
├── src/
│   ├── config/        # Firebase & Env Setup
│   ├── controllers/   # Request Handlers
│   ├── data/          # Mock Assets (GeoJSON)
│   ├── routes/        # API Endpoints
│   ├── services/      # Core Logic (Analysis, Storage, DB)
│   └── utils/         # Helpers (Logger, GeoJSON loader)
├── .env               # Environment variables
├── serviceAccountKey.json # (Ignored by git) Firebase credentials
└── package.json
```

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- A Firebase Project with **Firestore** and **Storage** enabled.
- A Firebase Service Account Key JSON file.

### 2. Installation
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

### 3. Configuration
1. Create a `.env` file in the `backend/` directory (copy from `.env.example`):
   ```bash
   PORT=3000
   FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
   ```
2. Place your `serviceAccountKey.json` in the `backend/` root folder.

### 4. Running Locally
```bash
# Production start
npm start

# Development mode (auto-restart)
npm run dev
```
Server will start on `http://localhost:3000`.

## 🔌 API Reference

### 1. Trigger Analysis
Simulates an analysis run.
- **URL**: `POST /api/analyze`
- **Body**:
  ```json
  {
    "region": "Aravalli-North",
    "type": "deforestation"
  }
  ```
- **Response**: JSON object containing risk score and Storage URL.

### 2. Get Analysis Areas
Fetches historical analysis data.
- **URL**: `GET /api/areas`
- **Query Params**:
  - `type` (optional): Filter by 'deforestation' or 'mining'.
  - `minRisk` (optional): Filter by minimum risk score (e.g., 50).
- **Example**: `GET /api/areas?type=deforestation&minRisk=60`

## 🛠 Future Improvements
- **Earth Engine Integration**: The `analysis.service.js` has placeholders for GEE authentication and `ee.ImageCollection` filtering.
- **Real-time Processing**: Replace mock `calculateRisk()` with actual spectral index calculation (NDVI/NDWI).

notepad README.md
