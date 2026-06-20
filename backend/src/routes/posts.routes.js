const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");

const {
  getPosts,
  createPost,
  updatePost,
  deletePost
} = require("../controllers/posts.controller");

router.get("/", verifyToken, getPosts);
router.post("/", createPost);
router.patch("/:id", updatePost);
router.delete("/:id", deletePost);

module.exports = router;