import db from "./client.js";

// Connect to database
db.connect(async function (err) {
  if (err) {
    console.log("Error connecting to database:", err);
    process.exit(1);
  }

  console.log("Connected to database");

  try {
    // Insert sample ballets
    const balletsQuery = `
      INSERT INTO Ballets (title, composer, choreographer, year_premiered, description, difficulty_level, duration_minutes) VALUES
      ('Swan Lake', 'Pyotr Ilyich Tchaikovsky', 'Marius Petipa', 1877, 'A classical ballet about a princess turned into a swan by an evil sorcerer.', 'Advanced', 150),
      ('The Nutcracker', 'Pyotr Ilyich Tchaikovsky', 'Marius Petipa', 1892, 'A magical Christmas ballet about a girl and her nutcracker prince.', 'Intermediate', 90),
      ('Giselle', 'Adolphe Adam', 'Jean Coralli', 1841, 'A romantic ballet about a peasant girl who dies of a broken heart.', 'Advanced', 120)
      RETURNING id, title
    `;

    db.query(balletsQuery, [], function (err, balletsResult) {
      if (err) {
        console.log("Error inserting ballets:", err);
        process.exit(1);
      }

      console.log("Ballets inserted:", balletsResult.rows);

      // Insert sample steps
      const stepsQuery = `
        INSERT INTO Steps (name, description, difficulty) VALUES
        ('Plie', 'A bending of the knees while maintaining proper alignment', 'Beginner'),
        ('Tendu', 'A stretching of the foot along the floor', 'Beginner'),
        ('Demi-plie', 'A half bend of the knees', 'Beginner'),
        ('Grand plie', 'A full bend of the knees', 'Intermediate'),
        ('Battement', 'A beating movement of the leg', 'Intermediate'),
        ('Pirouette', 'A turn on one foot', 'Advanced')
        RETURNING id, name
      `;

      db.query(stepsQuery, [], function (err, stepsResult) {
        if (err) {
          console.log("Error inserting steps:", err);
          process.exit(1);
        }

        console.log("Steps inserted:", stepsResult.rows);

        // Insert sample equipment
        const equipmentQuery = `
          INSERT INTO Equipment (name, description, category) VALUES
          ('Pointe Shoes', 'Specialized ballet shoes for dancing on toes', 'Footwear'),
          ('Tutu', 'Classical ballet skirt', 'Attire'),
          ('Leotard', 'Fitted dance garment', 'Attire'),
          ('Ballet Barre', 'Horizontal bar for ballet exercises', 'Training Equipment'),
          ('Dance Floor', 'Sprung floor for ballet practice', 'Facility')
          RETURNING id, name
        `;

        db.query(equipmentQuery, [], function (err, equipmentResult) {
          if (err) {
            console.log("Error inserting equipment:", err);
            process.exit(1);
          }

          console.log("Equipment inserted:", equipmentResult.rows);

          // Insert ballet-step relationships
          const balletStepsQuery = `
            INSERT INTO Ballet_Steps (ballet_id, step_id, sequence_order) VALUES
            ((SELECT id FROM Ballets WHERE title = 'Swan Lake'), (SELECT id FROM Steps WHERE name = 'Plie'), 1),
            ((SELECT id FROM Ballets WHERE title = 'Swan Lake'), (SELECT id FROM Steps WHERE name = 'Pirouette'), 2),
            ((SELECT id FROM Ballets WHERE title = 'The Nutcracker'), (SELECT id FROM Steps WHERE name = 'Tendu'), 1),
            ((SELECT id FROM Ballets WHERE title = 'The Nutcracker'), (SELECT id FROM Steps WHERE name = 'Battement'), 2),
            ((SELECT id FROM Ballets WHERE title = 'Giselle'), (SELECT id FROM Steps WHERE name = 'Grand plie'), 1)
          `;

          db.query(balletStepsQuery, [], function (err, balletStepsResult) {
            if (err) {
              console.log("Error inserting ballet steps:", err);
              process.exit(1);
            }

            console.log("Ballet steps relationships inserted");

            // Insert step-equipment relationships
            const stepEquipmentQuery = `
              INSERT INTO Step_Equipment (step_id, equipment_id, required) VALUES
              ((SELECT id FROM Steps WHERE name = 'Plie'), (SELECT id FROM Equipment WHERE name = 'Dance Floor'), true),
              ((SELECT id FROM Steps WHERE name = 'Plie'), (SELECT id FROM Equipment WHERE name = 'Ballet Barre'), false),
              ((SELECT id FROM Steps WHERE name = 'Tendu'), (SELECT id FROM Equipment WHERE name = 'Dance Floor'), true),
              ((SELECT id FROM Steps WHERE name = 'Tendu'), (SELECT id FROM Equipment WHERE name = 'Ballet Barre'), false),
              ((SELECT id FROM Steps WHERE name = 'Demi-plie'), (SELECT id FROM Equipment WHERE name = 'Dance Floor'), true),
              ((SELECT id FROM Steps WHERE name = 'Grand plie'), (SELECT id FROM Equipment WHERE name = 'Dance Floor'), true),
              ((SELECT id FROM Steps WHERE name = 'Grand plie'), (SELECT id FROM Equipment WHERE name = 'Ballet Barre'), true),
              ((SELECT id FROM Steps WHERE name = 'Battement'), (SELECT id FROM Equipment WHERE name = 'Dance Floor'), true),
              ((SELECT id FROM Steps WHERE name = 'Battement'), (SELECT id FROM Equipment WHERE name = 'Ballet Barre'), true),
              ((SELECT id FROM Steps WHERE name = 'Pirouette'), (SELECT id FROM Equipment WHERE name = 'Dance Floor'), true),
              ((SELECT id FROM Steps WHERE name = 'Pirouette'), (SELECT id FROM Equipment WHERE name = 'Pointe Shoes'), false)
            `;

            db.query(stepEquipmentQuery, [], function (err, stepEquipmentResult) {
              if (err) {
                console.log("Error inserting step equipment:", err);
                process.exit(1);
              }

              console.log("Step equipment relationships inserted");
              console.log("🌱 Database seeded successfully!");
              process.exit(0);
            });
          });
        });
      });
    });
  } catch (error) {
    console.log("Error:", error);
    process.exit(1);
  }
});
