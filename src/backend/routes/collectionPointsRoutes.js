const express = require("express");
const router = express.Router();

const collectionPointsController = require("../controllers/collectionPointsController");

router.post("/collection-points", collectionPointsController.create);
router.get("/collection-points", collectionPointsController.getAll);
router.delete("/collection-points/:id", collectionPointsController.remove);

module.exports = router;
