const pool = require("../database/db");
const getPosts = async (req, res, next) => {
  try {
    const page =
      parseInt(req.query.page) || 1;

    const limit =
      parseInt(req.query.limit) || 10;

    const offset =
      (page - 1) * limit;

    const {
      status,
      platform,
      search
    } = req.query;

    let query = `
      SELECT * FROM posts
      WHERE user_id = $1
    `;

    let values = [req.user.id];
    let count = 2;

    if (status) {
      query += ` AND status = $${count}`;
      values.push(status);
      count++;
    }

    if (platform) {
      query += ` AND $${count} = ANY(platforms)`;
      values.push(platform);
      count++;
    }

    if (search) {
      query += `
        AND (
          topic ILIKE $${count}
          OR content ILIKE $${count}
        )
      `;
      values.push(`%${search}%`);
      count++;
    }

    query += `
      ORDER BY id DESC
      LIMIT $${count}
      OFFSET $${count + 1}
    `;

    values.push(limit, offset);

    const result = await pool.query(
      query,
      values
    );

    res.status(200).json({
      page,
      limit,
      total: result.rows.length,
      posts: result.rows
    });

  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const {
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
      [
        req.user.id,
        topic,
        content,
        call_to_action,
        platforms
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
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
       AND user_id = $6
       RETURNING *`,
      [
        topic,
        content,
        call_to_action,
        status,
        id,
        req.user.id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        message: "Not authorized to update this post"
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM posts
       WHERE id = $1
       AND user_id = $2
       RETURNING *`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        message: "Not authorized to delete this post"
      });
    }

    res.json({
      message: "Post deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  createPost,
  updatePost,
  deletePost
};