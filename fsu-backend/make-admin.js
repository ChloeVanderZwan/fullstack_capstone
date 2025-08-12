import db from "./db/client.js";

// Connect to database
db.connect(async function (err) {
  if (err) {
    console.log("Error connecting to database:", err);
    process.exit(1);
  }

  console.log("Connected to database");

  // Get username from command line arguments
  const username = process.argv[2];

  if (!username) {
    console.log("Usage: node make-admin.js <username>");
    console.log("Example: node make-admin.js admin");
    process.exit(1);
  }

  try {
    // Update user to admin
    const query =
      "UPDATE users SET is_admin = TRUE WHERE username = $1 RETURNING username, email, is_admin";

    db.query(query, [username], function (err, result) {
      if (err) {
        console.log("Error updating user:", err);
        process.exit(1);
      }

      if (result.rows.length === 0) {
        console.log(`User '${username}' not found`);
        process.exit(1);
      }

      const user = result.rows[0];
      console.log(`✅ Successfully made '${user.username}' an admin!`);
      console.log(`Email: ${user.email}`);
      console.log(`Admin status: ${user.is_admin}`);

      process.exit(0);
    });
  } catch (error) {
    console.log("Error:", error);
    process.exit(1);
  }
});
