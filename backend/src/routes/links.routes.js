const express = require("express");

const router = express.Router();

const {
  getLinks,
  createLink,
  updateLink,
  deleteLink
} = require("../controllers/links.controller");

router.get("/", getLinks);
router.post("/", createLink);
router.patch("/:id", updateLink);
router.delete("/:id", deleteLink);

module.exports = router;