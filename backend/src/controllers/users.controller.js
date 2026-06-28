const pool = require("../database/db");

async function getUsers(req, res, next) {
  try {
    const result = await pool.query(
      "SELECT * FROM users ORDER BY id"
    );

    res.json(result.rows);

  } catch (error) {
    next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const {
      username,
      full_name,
      email,
      password_hash
    } = req.body;

    const result = await pool.query(
      `INSERT INTO users
      (username, full_name, email, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [username, full_name, email, password_hash]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    next(error);
  }
}

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { plan } = req.body;

    const result = await pool.query(
      "UPDATE users SET plan = $1 WHERE id = $2 RETURNING *",
      [plan, id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );

    res.json({
      message: "User deleted successfully",
      deletedUser: result.rows[0]
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser
};