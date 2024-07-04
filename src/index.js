const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use("/api/auth", authRoutes);

const createUsersTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      display_name VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(queryText);
    console.log("Users table created successfully.");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
};

// Call the function to create the users table
createUsersTable();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
