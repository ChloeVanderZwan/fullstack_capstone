import express from "express";
import cors from "cors";
import balletRoutes from "./routes/ballets.js";
import authRoutes from "./routes/auth.js";

const app = express();

// CORS setup - explicit configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Allow the specific frontend origin
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Parse JSON
app.use(express.json());

// Test route
app.get("/test", function (req, res) {
  res.json({ message: "Server is working!" });
});

// Use routes
app.use("/api", balletRoutes);
app.use("/api/auth", authRoutes);

export default app;
