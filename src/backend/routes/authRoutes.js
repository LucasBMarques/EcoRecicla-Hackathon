const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.post("/auth/validate-session", authController.validateSession);
router.post("/auth/update-profile", authController.updateProfile);
router.put("/auth/update-password", authController.updatePassword);
router.delete("/auth/delete-account", authController.deleteAccount);
router.get("/auth/profile/:userId", authController.getUserProfile);
router.put("/auth/update-preferences", authController.updatePreferences);
router.get("/auth/preferences/:userId", authController.getPreferences);

module.exports = router;