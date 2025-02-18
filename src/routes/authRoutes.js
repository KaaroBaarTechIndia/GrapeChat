const express = require("express");
const {
  register,
  login,
  getProfile,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile/:id", authMiddleware, getProfile);

module.exports = router;
