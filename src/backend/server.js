const express = require("express");
const cors = require("cors");
const fs = require("fs");
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

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
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

const frontendDistPath = path.join(__dirname, "../frontend/dist");
const frontendIndexPath = path.join(frontendDistPath, "index.html");

if (fs.existsSync(frontendIndexPath)) {
  app.use(express.static(frontendDistPath));

  app.use((req, res, next) => {
    if (req.method !== "GET") return next();
    if (req.path.startsWith("/api") || req.path === "/health" || req.path.startsWith("/uploads")) {
      return next();
    }
    return res.sendFile(frontendIndexPath);
  });
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});