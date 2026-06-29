const pool = require("../database/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/*
REGISTER USER
*/
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

/*
LOGIN USER
*/
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

    // ACCESS TOKEN
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        roles: user.roles
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m"
      }
    );

    // REFRESH TOKEN
    const refreshToken = jwt.sign(
      {
        id: user.id
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken
    });

  } catch (error) {
    next(error);
  }
};

/*
REFRESH ACCESS TOKEN
*/
const refreshAccessToken = async (
  req,
  res,
  next
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token required"
      });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      (error, decoded) => {
        if (error) {
          return res.status(403).json({
            message: "Invalid refresh token"
          });
        }

        const newAccessToken = jwt.sign(
          {
            id: decoded.id
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "15m"
          }
        );

        res.status(200).json({
          accessToken: newAccessToken
        });
      }
    );

  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken
};