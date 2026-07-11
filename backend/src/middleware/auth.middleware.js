const jwt = require("jsonwebtoken");
const pool = require("../database/db");

const verifyToken = async (
  req,
  res,
  next
) => {
  const authHeader =
    req.headers.authorization;

  /*
  CHECK AUTHORIZATION HEADER
  */
  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      message:
        "Invalid authorization header"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    /*
    VERIFY ACCESS TOKEN
    */
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    /*
    FETCH ONLY REQUIRED USER DATA
    */
    const result = await pool.query(
      `SELECT
        id,
        email,
        roles,
        is_active
       FROM users
       WHERE id = $1`,
      [decoded.id]
    );

    const user = result.rows[0];

    /*
    USER NOT FOUND
    */
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    /*
    ACCOUNT DISABLED
    */
    if (!user.is_active) {
      return res.status(403).json({
        message: "Account suspended"
      });
    }

    /*
    ATTACH USER TO REQUEST
    */
    req.user = user;

    next();

  } catch (error) {
    next(error);
  }
};

module.exports = verifyToken;