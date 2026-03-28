const express = require("express");
const router = express.Router();

const materialsController = require("../controllers/materialsController");

router.get("/materials", materialsController.getAll);

module.exports = router;
