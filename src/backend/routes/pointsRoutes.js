const express = require("express");
const router = express.Router();

const pointsController = require("../controllers/pointsController");

router.get("/points", pointsController.getPoints);
router.post("/points", pointsController.addPoint);

module.exports = router;