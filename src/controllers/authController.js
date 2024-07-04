const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

exports.register = async (req, res) => {
  const { displayName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (display_name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [displayName, email, hashedPassword]
    );
    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
