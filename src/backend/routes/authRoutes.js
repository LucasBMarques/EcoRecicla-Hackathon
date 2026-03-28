const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.post("/auth/update-profile", authController.updateProfile);
router.get("/auth/profile/:userId", authController.getUserProfile);

module.exports = router;