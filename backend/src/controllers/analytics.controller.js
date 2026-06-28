const pool = require("../database/db");

const getAnalytics = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM analytics_events"
    );

    res.status(200).json(result.rows);

  } catch (error) {
    next(error);
  }
};

const createAnalytics = async (req, res, next) => {
  try {
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

  } catch (error) {
    next(error);
  }
};

const updateAnalytics = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      event_type,
      platform,
      country,
      device_type
    } = req.body;

    const result = await pool.query(
      `UPDATE analytics_events
      SET
        event_type = $1,
        platform = $2,
        country = $3,
        device_type = $4
      WHERE id = $5
      RETURNING *`,
      [
        event_type,
        platform,
        country,
        device_type,
        id
      ]
    );

    res.status(200).json(result.rows[0]);

  } catch (error) {
    next(error);
  }
};

const deleteAnalytics = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM analytics_events WHERE id = $1",
      [id]
    );

    res.status(200).json({
      message: "Analytics event deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics,
  createAnalytics,
  updateAnalytics,
  deleteAnalytics
};