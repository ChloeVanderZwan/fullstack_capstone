import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import db from "./db/client.js";

const PORT = process.env.PORT || 3002;

// Connect to database
db.connect(function (err) {
  if (err) {
    console.log("Database connection failed");
    return;
  }
  console.log("Connected to database");
});

// Start server
app.listen(PORT, function () {
  console.log("Server is running on port " + PORT);
});
