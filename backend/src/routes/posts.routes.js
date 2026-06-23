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
router.post("/", verifyToken, createPost);
router.patch("/:id", verifyToken,  updatePost);
router.delete("/:id", verifyToken,  deletePost);

module.exports = router;