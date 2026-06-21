const express = require("express");
const router = express.Router();

const collectionPointsController = require("../controllers/collectionPointsController");
const { createCollectionPointNotification } = require("../controllers/notificationsController");

// Middleware que dispara notificações após criação bem-sucedida de ponto
const notifyOnCreate = (req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    if (res.statusCode === 200 && req.body?.name && req.body?.address) {
      createCollectionPointNotification(req.body.name, req.body.address);
    }
    return originalJson(data);
  };
  next();
};

router.post("/collection-points", notifyOnCreate, collectionPointsController.create);
router.get("/collection-points", collectionPointsController.getAll);
router.put("/collection-points/:id", collectionPointsController.update);
router.delete("/collection-points/:id", collectionPointsController.remove);

module.exports = router;