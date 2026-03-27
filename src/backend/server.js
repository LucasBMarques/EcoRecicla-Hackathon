const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const pointsRoutes = require("./routes/pointsRoutes");
const collectionPointsRoutes = require("./routes/collectionPointsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", pointsRoutes);
app.use("/api", collectionPointsRoutes);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});