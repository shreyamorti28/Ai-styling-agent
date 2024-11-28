const functions = require("firebase-functions");
const express = require("express");
const app = express();

// Define your API routes here
app.get("/api", (req, res) => {
  res.send("Hello, Firebase Functions!");
});

// Export the function to Firebase Functions
exports.api = functions.https.onRequest(app);
