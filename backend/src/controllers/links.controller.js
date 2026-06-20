const pool = require("../database/db");


/*
GET ALL LINKS
*/
const getLinks = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM promotion_links ORDER BY id ASC"
  );

  res.json(result.rows);
};

/*
CREATE NEW LINK
*/
const createLink = async (req, res) => {
  const {
    post_id,
    platform,
    slug,
    destination_url
  } = req.body;

  const result = await pool.query(
    `INSERT INTO promotion_links
    (post_id, platform, slug, destination_url)
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
    [post_id, platform, slug, destination_url]
  );

  res.status(201).json(result.rows[0]);
};

const updateLink = async (req, res) => {
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
     RETURNING *`,
    [platform, slug, destination_url, is_active, id]
  );

  res.json(result.rows[0]);
};

const deleteLink = async (req, res) => {
  const { id } = req.params;

  await pool.query(
    "DELETE FROM promotion_links WHERE id = $1",
    [id]
  );

  res.json({
    message: "Link deleted successfully"
  });
};

module.exports = {
  getLinks,
  createLink,
  updateLink,
  deleteLink
};