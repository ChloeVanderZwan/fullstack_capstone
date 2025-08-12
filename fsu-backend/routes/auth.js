import express from "express";
import db from "../db/client.js";
import {
  createToken,
  hashPassword,
  comparePassword,
  authenticateToken
} from "../utils/auth.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM users WHERE username = $1 OR email = $2",
        [username, email],
        (err, result) => {
          if (err) reject(err);
          else resolve(result.rows[0]);
        }
      );
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create new user
    const newUser = await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, is_admin",
        [username, email, passwordHash],
        (err, result) => {
          if (err) reject(err);
          else resolve(result.rows[0]);
        }
      );
    });

    // Create token
    const token = createToken({
      id: newUser.id,
      username: newUser.username,
      is_admin: newUser.is_admin
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        is_admin: newUser.is_admin
      },
      token
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM users WHERE username = $1",
        [username],
        (err, result) => {
          if (err) reject(err);
          else resolve(result.rows[0]);
        }
      );
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Create token
    const token = createToken({
      id: user.id,
      username: user.username,
      is_admin: user.is_admin
    });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        is_admin: user.is_admin
      },
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Get current user (protected route)
router.get("/me", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

export default router;
