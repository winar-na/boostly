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

    if (!user.is_active) {
      return res.status(403).json({
        message: "Account suspended"
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

    const refreshToken = jwt.sign(
      {
        id: user.id
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d"
      }
    );

    await pool.query(
      "UPDATE users SET refresh_token = $1 WHERE id = $2",
      [refreshToken, user.id]
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
      async (error, decoded) => {
        if (error) {
          return res.status(403).json({
            message: "Invalid refresh token"
          });
        }

        const userResult = await pool.query(
          "SELECT * FROM users WHERE id = $1",
          [decoded.id]
        );

        const user = userResult.rows[0];

        // INVALIDATION CHECK
        if (
          !user ||
          user.refresh_token !== refreshToken
        ) {
          return res.status(403).json({
            message: "Refresh token invalid"
          });
        }

        // ACCOUNT STATUS CHECK
        if (!user.is_active) {
          return res.status(403).json({
            message: "Account suspended"
          });
        }

        const newAccessToken = jwt.sign(
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

        res.status(200).json({
          accessToken: newAccessToken
        });
      }
    );

  } catch (error) {
    next(error);
  }
};

/*
LOGOUT USER
*/
const logoutUser = async (
  req,
  res,
  next
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token required"
      });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE refresh_token = $1",
      [refreshToken]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    await pool.query(
      "UPDATE users SET refresh_token = NULL WHERE id = $1",
      [user.id]
    );

    res.status(200).json({
      message: "Logged out successfully"
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser
};