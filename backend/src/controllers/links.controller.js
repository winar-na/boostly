const pool = require("../database/db");


const getLinks = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT pl.*
       FROM promotion_links pl
       JOIN posts p ON pl.post_id = p.id
       WHERE p.user_id = $1
       ORDER BY pl.id ASC`,
      [req.user.id]
    );
    res.json(result.rows);

  } catch (error) {
    next(error);
  }
};

const redirectLink = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      `UPDATE promotion_links
       SET click_count = click_count + 1
       WHERE slug = $1
       AND is_active = TRUE
       RETURNING destination_url`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Promotion link not found or inactive"
      });
    }

    const destinationUrl = result.rows[0].destination_url;

    res.redirect(destinationUrl);

  } catch (error) {
    next(error);
  }
};

const createLink = async (req, res, next) => {
  try {
    const {
      post_id,
      platform,
      slug,
      destination_url
    } = req.body;

    const postCheck = await pool.query(
      "SELECT * FROM posts WHERE id = $1 AND user_id = $2",
      [post_id, req.user.id]
    );

    if (postCheck.rows.length === 0) {
      return res.status(403).json({
        message: "Not authorized to attach link to this post"
      });
    }

    const result = await pool.query(
      `INSERT INTO promotion_links
      (post_id, platform, slug, destination_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [
        post_id,
        platform,
        slug,
        destination_url
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    next(error);
  }
};

const updateLink = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      platform,
      slug,
      destination_url,
      is_active
    } = req.body;

    const result = await pool.query(
      `UPDATE promotion_links
       SET
         platform = $1,
         slug = $2,
         destination_url = $3,
         is_active = $4
       WHERE id = $5
       AND post_id IN (
         SELECT id FROM posts WHERE user_id = $6
       )
       RETURNING *`,
      [
        platform,
        slug,
        destination_url,
        is_active,
        id,
        req.user.id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        message: "Not authorized to update this link"
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    next(error);
  }
};

const deleteLink = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM promotion_links
       WHERE id = $1
       AND post_id IN (
         SELECT id FROM posts WHERE user_id = $2
       )
       RETURNING *`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        message: "Not authorized to delete this link"
      });
    }

    res.json({
      message: "Link deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLinks,
  redirectLink,
  createLink,
  updateLink,
  deleteLink
};