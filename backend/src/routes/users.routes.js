const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");


const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser
  
} = require("../controllers/users.controller");

router.get("/", verifyToken, getUsers);

router.post("/", verifyToken, createUser);

router.get("/:id", verifyToken, getUserById);

router.patch("/:id", verifyToken, updateUser);

router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin"),
  deleteUser
);
module.exports = router;