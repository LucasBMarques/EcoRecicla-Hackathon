const express = require("express");
const router = express.Router();

const collectionPointsController = require("../controllers/collectionPointsController");

router.post("/collection-points", collectionPointsController.create);
router.get("/collection-points", collectionPointsController.getAll);

module.exports = router;