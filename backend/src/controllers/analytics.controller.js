const pool = require("../database/db");

const getAnalytics = async(req,res) => {
    const result = await pool.query(
        "select * from analytics_events"
    );
    res.json(result.rows);
};

const postAnalytics = async (req, res) => {
  const {
    user_id,
    post_id,
    promotion_link_id,
    event_type,
    platform,
    country,
    device_type
  } = req.body;

  const result = await pool.query(
    `INSERT INTO analytics_events
    (
      user_id,
      post_id,
      promotion_link_id,
      event_type,
      platform,
      country,
      device_type
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      user_id,
      post_id,
      promotion_link_id,
      event_type,
      platform,
      country,
      device_type
    ]
  );

  res.status(201).json(result.rows[0]);
};

const patchAnalytics = async (req, res) => {
  const { id } = req.params;

  const {
    country,
    device_type
  } = req.body;

  const result = await pool.query(
    `UPDATE analytics_events
    SET country = $1,
        device_type = $2
    WHERE id = $3
    RETURNING *`,
    [country, device_type, id]
  );

  res.json(result.rows[0]);
};

const deleteAnalytics = async (req, res) => {
  const { id } = req.params;

  await pool.query(
    "DELETE FROM analytics_events WHERE id = $1",
    [id]
  );

  res.json({
    message: "Analytics deleted successfully"
  });
};

module.exports={
    getAnalytics,
    postAnalytics,
    patchAnalytics,
    deleteAnalytics
};
