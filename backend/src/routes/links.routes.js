const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");

const {
  getLinks,
  createLink,
  updateLink,
  deleteLink
} = require("../controllers/links.controller");

router.get("/", verifyToken, getLinks);
router.post("/", verifyToken, createLink);
router.patch("/:id", verifyToken, updateLink);
router.delete("/:id", verifyToken, deleteLink);

module.exports = router;