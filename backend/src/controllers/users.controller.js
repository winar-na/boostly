const pool = require("../database/db");

async function getUsers(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM users ORDER BY id"
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
}

async function createUser(req, res) {
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

    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
}


const getUserById = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );

  res.json(result.rows[0]);
}

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { plan } = req.body;

  const result = await pool.query(
    "UPDATE users SET plan = $1 WHERE id = $2 RETURNING *",
    [plan, id]
  );

  res.json(result.rows[0]);
}

const deleteUser = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [id]
  );

  res.json({
    message: "User deleted successfully",
    deletedUser: result.rows[0]
  });
}

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser
};