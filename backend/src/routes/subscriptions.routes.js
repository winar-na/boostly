const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/roles.middleware");

const {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription
} = require("../controllers/subscriptions.controller");

router.get("/", verifyToken, getSubscriptions);

router.post(
  "/",
  verifyToken,
  allowRoles("admin"),
  createSubscription
);

router.patch("/:id", verifyToken, updateSubscription);

router.delete("/:id", verifyToken, deleteSubscription);

module.exports = router;