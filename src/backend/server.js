const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const collectionPointsRoutes = require("./routes/collectionPointsRoutes");
const materialsRoutes = require("./routes/materialsRoutes");
const recyclingRoutes = require("./routes/recyclingRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const statsRoutes = require("./routes/homeRoutes");
const notificationsRoutes = require("./routes/notificationsRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", authRoutes);
app.use("/api", collectionPointsRoutes);
app.use("/api", materialsRoutes);
app.use("/api", recyclingRoutes);
app.use("/api", scheduleRoutes);
app.use("/api", uploadRoutes);
app.use("/api", statsRoutes);
app.use("/api", notificationsRoutes);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});