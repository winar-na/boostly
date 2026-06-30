const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser
} = require("../controllers/auth.controller");

const {
  validateRegister,
  validateLogin
} = require("../middleware/validate.middleware");

router.post(
  "/register",
  validateRegister,
  registerUser
);

router.post(
  "/login",
  validateLogin,
  loginUser
);


router.post(
  "/refresh", 
  refreshAccessToken);

  router.post(
  "/logout",
  logoutUser
);

module.exports = router;