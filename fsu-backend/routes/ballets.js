import express from "express";
import db from "../db/client.js";
import { authenticateToken, requireAdmin } from "../utils/auth.js";

const router = express.Router();

// Get all ballets
router.get("/ballets", function (req, res) {
  const query = "SELECT * FROM ballets ORDER BY title";

  db.query(query, [], function (err, result) {
    if (err) {
      console.log("Error getting ballets:", err);
      res.status(500).json({ error: "Failed to get ballets" });
    } else {
      res.json(result.rows);
    }
  });
});

// Get ballet by ID
router.get("/ballets/:id", function (req, res) {
  const id = req.params.id;
  const query = "SELECT * FROM ballets WHERE id = $1";

  db.query(query, [id], function (err, result) {
    if (err) {
      console.log("Error getting ballet:", err);
      res.status(500).json({ error: "Failed to get ballet" });
    } else if (result.rows.length === 0) {
      res.status(404).json({ error: "Ballet not found" });
    } else {
      res.json(result.rows[0]);
    }
  });
});

// Submit new ballet (requires authentication)
router.post("/ballets", authenticateToken, function (req, res) {
  const {
    title,
    composer,
    choreographer,
    year_premiered,
    difficulty_level,
    duration_minutes,
    description
  } = req.body;

  if (!title || !composer || !choreographer) {
    return res
      .status(400)
      .json({ error: "Title, composer, and choreographer are required" });
  }

  const query = `
    INSERT INTO ballets (title, composer, choreographer, year_premiered, difficulty_level, duration_minutes, description, submitted_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;

  db.query(
    query,
    [
      title,
      composer,
      choreographer,
      year_premiered,
      difficulty_level,
      duration_minutes,
      description,
      req.user.id
    ],
    function (err, result) {
      if (err) {
        console.log("Error submitting ballet:", err);
        res.status(500).json({ error: "Failed to submit ballet" });
      } else {
        res.status(201).json({
          message: "Ballet submitted successfully",
          ballet: result.rows[0]
        });
      }
    }
  );
});

// Delete ballet (requires admin)
router.delete(
  "/ballets/:id",
  authenticateToken,
  requireAdmin,
  function (req, res) {
    const id = req.params.id;
    const query = "DELETE FROM ballets WHERE id = $1 RETURNING *";

    db.query(query, [id], function (err, result) {
      if (err) {
        console.log("Error deleting ballet:", err);
        res.status(500).json({ error: "Failed to delete ballet" });
      } else if (result.rows.length === 0) {
        res.status(404).json({ error: "Ballet not found" });
      } else {
        res.json({
          message: "Ballet deleted successfully",
          ballet: result.rows[0]
        });
      }
    });
  }
);

// Get steps for a ballet
router.get("/ballets/:id/steps", function (req, res) {
  const id = req.params.id;
  const query = `
    SELECT s.*, bs.sequence_order 
    FROM steps s 
    JOIN ballet_steps bs ON s.id = bs.step_id 
    WHERE bs.ballet_id = $1 
    ORDER BY bs.sequence_order
  `;

  db.query(query, [id], function (err, result) {
    if (err) {
      console.log("Error getting ballet steps:", err);
      res.status(500).json({ error: "Failed to get ballet steps" });
    } else {
      res.json(result.rows);
    }
  });
});

// Get all steps
router.get("/steps", function (req, res) {
  const query = "SELECT * FROM steps ORDER BY name";

  db.query(query, [], function (err, result) {
    if (err) {
      console.log("Error getting steps:", err);
      res.status(500).json({ error: "Failed to get steps" });
    } else {
      res.json(result.rows);
    }
  });
});

// Submit new step (requires authentication)
router.post("/steps", authenticateToken, function (req, res) {
  const { name, description, difficulty } = req.body;

  if (!name || !description || !difficulty) {
    return res
      .status(400)
      .json({ error: "Name, description, and difficulty are required" });
  }

  const query = `
    INSERT INTO steps (name, description, difficulty, submitted_by)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  db.query(
    query,
    [name, description, difficulty, req.user.id],
    function (err, result) {
      if (err) {
        console.log("Error submitting step:", err);
        res.status(500).json({ error: "Failed to submit step" });
      } else {
        res.status(201).json({
          message: "Step submitted successfully",
          step: result.rows[0]
        });
      }
    }
  );
});

// Delete step (requires admin)
router.delete(
  "/steps/:id",
  authenticateToken,
  requireAdmin,
  function (req, res) {
    const id = req.params.id;
    const query = "DELETE FROM steps WHERE id = $1 RETURNING *";

    db.query(query, [id], function (err, result) {
      if (err) {
        console.log("Error deleting step:", err);
        res.status(500).json({ error: "Failed to delete step" });
      } else if (result.rows.length === 0) {
        res.status(404).json({ error: "Step not found" });
      } else {
        res.json({
          message: "Step deleted successfully",
          step: result.rows[0]
        });
      }
    });
  }
);

// Get equipment for a step
router.get("/steps/:id/equipment", function (req, res) {
  const id = req.params.id;
  const query = `
    SELECT e.*, se.required 
    FROM equipment e 
    JOIN step_equipment se ON e.id = se.equipment_id 
    WHERE se.step_id = $1
  `;

  db.query(query, [id], function (err, result) {
    if (err) {
      console.log("Error getting step equipment:", err);
      res.status(500).json({ error: "Failed to get step equipment" });
    } else {
      res.json(result.rows);
    }
  });
});

// Get all equipment
router.get("/equipment", function (req, res) {
  const query = "SELECT * FROM equipment ORDER BY name";

  db.query(query, [], function (err, result) {
    if (err) {
      console.log("Error getting equipment:", err);
      res.status(500).json({ error: "Failed to get equipment" });
    } else {
      res.json(result.rows);
    }
  });
});

// Submit new equipment (requires authentication)
router.post("/equipment", authenticateToken, function (req, res) {
  const { name, description, category } = req.body;

  if (!name || !description || !category) {
    return res
      .status(400)
      .json({ error: "Name, description, and category are required" });
  }

  const query = `
    INSERT INTO equipment (name, description, category, submitted_by)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  db.query(
    query,
    [name, description, category, req.user.id],
    function (err, result) {
      if (err) {
        console.log("Error submitting equipment:", err);
        res.status(500).json({ error: "Failed to submit equipment" });
      } else {
        res.status(201).json({
          message: "Equipment submitted successfully",
          equipment: result.rows[0]
        });
      }
    }
  );
});

// Delete equipment (requires admin)
router.delete(
  "/equipment/:id",
  authenticateToken,
  requireAdmin,
  function (req, res) {
    const id = req.params.id;
    const query = "DELETE FROM equipment WHERE id = $1 RETURNING *";

    db.query(query, [id], function (err, result) {
      if (err) {
        console.log("Error deleting equipment:", err);
        res.status(500).json({ error: "Failed to delete equipment" });
      } else if (result.rows.length === 0) {
        res.status(404).json({ error: "Equipment not found" });
      } else {
        res.json({
          message: "Equipment deleted successfully",
          equipment: result.rows[0]
        });
      }
    });
  }
);

// Get ballets with their steps
router.get("/ballets-with-steps", function (req, res) {
  const balletsQuery = "SELECT * FROM ballets ORDER BY title";

  db.query(balletsQuery, [], function (err, balletsResult) {
    if (err) {
      console.log("Error getting ballets:", err);
      res.status(500).json({ error: "Failed to get ballets" });
      return;
    }

    const ballets = balletsResult.rows;
    let completed = 0;
    const totalBallets = ballets.length;

    if (totalBallets === 0) {
      res.json([]);
      return;
    }

    ballets.forEach(function (ballet) {
      const stepsQuery = `
        SELECT s.*, bs.sequence_order 
        FROM steps s 
        JOIN ballet_steps bs ON s.id = bs.step_id 
        WHERE bs.ballet_id = $1 
        ORDER BY bs.sequence_order
      `;

      db.query(stepsQuery, [ballet.id], function (err, stepsResult) {
        if (err) {
          console.log("Error getting steps for ballet:", err);
        } else {
          ballet.steps = stepsResult.rows;
        }

        completed++;
        if (completed === totalBallets) {
          res.json(ballets);
        }
      });
    });
  });
});

// Get steps with equipment
router.get("/steps-with-equipment", function (req, res) {
  const stepsQuery = "SELECT * FROM steps ORDER BY name";

  db.query(stepsQuery, [], function (err, stepsResult) {
    if (err) {
      console.log("Error getting steps:", err);
      res.status(500).json({ error: "Failed to get steps" });
      return;
    }

    const steps = stepsResult.rows;
    let completed = 0;
    const totalSteps = steps.length;

    if (totalSteps === 0) {
      res.json([]);
      return;
    }

    steps.forEach(function (step) {
      const equipmentQuery = `
        SELECT e.*, se.required 
        FROM equipment e 
        JOIN step_equipment se ON e.id = se.equipment_id 
        WHERE se.step_id = $1
      `;

      db.query(equipmentQuery, [step.id], function (err, equipmentResult) {
        if (err) {
          console.log("Error getting equipment for step:", err);
        } else {
          step.equipment = equipmentResult.rows;
        }

        completed++;
        if (completed === totalSteps) {
          res.json(steps);
        }
      });
    });
  });
});

export default router;
