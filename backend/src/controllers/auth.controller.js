const pool = require("../database/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res, next) => {
  try {
    const {
      username,
      full_name,
      email,
      password
    } = req.body;

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const result = await pool.query(
      `INSERT INTO users
      (username, full_name, email, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [
        username,
        full_name,
        email,
        hashedPassword
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        roles: user.roles
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser
};