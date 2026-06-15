const pool = require("../database/db");

const getPosts = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM posts"
  );

  res.json(result.rows);
}

const createPost = async (req, res) => {
  const {
    user_id,
    topic,
    content,
    call_to_action,
    platforms
  } = req.body;

  const result = await pool.query(
    `INSERT INTO posts
    (user_id, topic, content, call_to_action, platforms)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [user_id, topic, content, call_to_action, platforms]
  );

  res.status(201).json(result.rows[0]);
}

const updatePost = async (req, res) => {
  const { id } = req.params;

  const {
    topic,
    content,
    call_to_action,
    status
  } = req.body;

  const result = await pool.query(
    `UPDATE posts
     SET topic = $1,
         content = $2,
         call_to_action = $3,
         status = $4,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $5
     RETURNING *`,
    [topic, content, call_to_action, status, id]
  );

  res.json(result.rows[0]);
};

const deletePost = async (req, res) => {
  const { id } = req.params;

  await pool.query(
    "DELETE FROM posts WHERE id = $1",
    [id]
  );

  res.json({
    message: "Post deleted successfully"
  });
};

module.exports = {
  getPosts,
  createPost,
  updatePost,
  deletePost

};
