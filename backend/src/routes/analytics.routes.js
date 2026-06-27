const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/roles.middleware");

const {
  getAnalytics,
  createAnalytics,
  updateAnalytics,
  deleteAnalytics
} = require("../controllers/analytics.controller");

router.get(
  "/",
  verifyToken,
  allowRoles("admin", "creator"),
  getAnalytics
);

router.post("/", verifyToken, createAnalytics);

router.patch("/:id", verifyToken, updateAnalytics);

router.delete("/:id", verifyToken, deleteAnalytics);

module.exports = router;