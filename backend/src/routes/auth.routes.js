const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser
} = require("../controllers/auth.controller");

const {
  validateRegister
} = require("../middleware/validate.middleware");


router.post(
  "/register",
  validateRegister,
  registerUser
);

router.post("/login", loginUser);

module.exports = router;