const pool = require("../database/db");

const getSubscriptions = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM subscriptions"
    );

    res.status(200).json(result.rows);

  } catch (error) {
    next(error);
  }
};

const createSubscription = async (req, res, next) => {
  try {
    const {
      user_id,
      plan_name,
      billing_cycle,
      status,
      ends_at
    } = req.body;

    const result = await pool.query(
      `INSERT INTO subscriptions
      (
        user_id,
        plan_name,
        billing_cycle,
        status,
        ends_at
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        user_id,
        plan_name,
        billing_cycle,
        status,
        ends_at
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      plan_name,
      billing_cycle,
      status,
      ends_at
    } = req.body;

    const result = await pool.query(
      `UPDATE subscriptions
      SET
        plan_name = $1,
        billing_cycle = $2,
        status = $3,
        ends_at = $4
      WHERE id = $5
      RETURNING *`,
      [
        plan_name,
        billing_cycle,
        status,
        ends_at,
        id
      ]
    );

    res.status(200).json(result.rows[0]);

  } catch (error) {
    next(error);
  }
};

const deleteSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM subscriptions WHERE id = $1",
      [id]
    );

    res.status(200).json({
      message: "Subscription deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription
};