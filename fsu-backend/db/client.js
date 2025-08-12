import { Client } from "pg";

// Create database connection with explicit database name
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  database: "fsu" // Explicitly specify the database
});

// Connect to database
function connect(callback) {
  console.log("Connecting to database with URL:", process.env.DATABASE_URL);
  client.connect(function (err) {
    if (err) {
      console.log("Error connecting to database:", err);
      callback(err);
    } else {
      console.log("Connected to database successfully");
      // Test the connection by querying the current database
      client.query(
        "SELECT current_database(), current_schema();",
        [],
        function (err, result) {
          if (err) {
            console.log("Error testing connection:", err);
          } else {
            console.log("Connected to database:", result.rows[0]);
            // Verify we're in the right database
            if (result.rows[0].current_database !== "fsu") {
              console.log(
                "WARNING: Connected to wrong database:",
                result.rows[0].current_database
              );
            }
          }
        }
      );
      callback(null);
    }
  });
}

// Query function
function query(text, params, callback) {
  client.query(text, params, function (err, result) {
    if (err) {
      console.log("Query error:", err);
      callback(err);
    } else {
      callback(null, result);
    }
  });
}

export default {
  connect: connect,
  query: query
};
