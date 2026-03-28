const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const collectionPointsRoutes = require("./routes/collectionPointsRoutes");
const materialsRoutes = require("./routes/materialsRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api", authRoutes);
app.use("/api", collectionPointsRoutes);
app.use("/api", materialsRoutes);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});