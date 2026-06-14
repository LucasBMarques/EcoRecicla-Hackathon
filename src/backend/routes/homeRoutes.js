const express = require("express");
const router = express.Router();
<<<<<<< Updated upstream
const statsController = require("../controllers/homeController");
=======
const db = require("../config/db");
const homeController = require("../controllers/homeController");
>>>>>>> Stashed changes

router.get("/stats", homeController.getStats);

module.exports = router;