const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

try {
  // Initialize Firebase Admin SDK
  // Check if serviceAccountKey.json exists in the root or config folder
  const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');

  if (!admin.apps.length) {
    if (fs.existsSync(serviceAccountPath)) {
      console.log('Found serviceAccountKey.json, using it for credentials...');
      const serviceAccount = require(serviceAccountPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      });
    } else {
      console.log('serviceAccountKey.json not found, attempting default credentials (expected in GOOGLE_APPLICATION_CREDENTIALS)...');
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      });
    }
    console.log('Firebase Admin Initialized successfully');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  // We don't exit process here strictly, but DB calls will fail if this didn't work.
}

const db = admin.firestore();
const storage = admin.storage();
const bucket = storage.bucket();

module.exports = { admin, db, storage, bucket };
