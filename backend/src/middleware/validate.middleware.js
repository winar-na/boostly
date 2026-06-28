const validateRegister = (req, res, next) => {
  const {
    username,
    full_name,
    email,
    password
  } = req.body;

  if (!username || !full_name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format"
    });
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must have uppercase, lowercase, number, special character and be at least 8 characters"
    });
  }

  next();
};

module.exports = {
  validateRegister
};