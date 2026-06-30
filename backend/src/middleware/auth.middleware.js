const jwt = require("jsonwebtoken");
const pool = require("../database/db");

const verifyToken = async (
  req,
  res,
  next
) => {
  const authHeader =
    req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message:
        "Access denied. No token provided."
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // VERIFY JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // CHECK USER IN DATABASE
    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [decoded.id]
    );

    const user = result.rows[0];

    // USER DOES NOT EXIST
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // USER SUSPENDED
    if (!user.is_active) {
      return res.status(403).json({
        message: "Account suspended"
      });
    }

    // ATTACH LIVE USER DATA
    req.user = {
      id: user.id,
      email: user.email,
      roles: user.roles
    };

    next();

  } catch (error) {
    res.status(403).json({
      message:
        "Invalid or expired token"
    });
  }
};

module.exports = verifyToken;