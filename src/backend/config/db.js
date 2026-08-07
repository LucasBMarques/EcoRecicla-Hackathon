const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");

const connectionUrl = process.env.MYSQL_PRIVATE_URL || process.env.DATABASE_URL;

function parseConnectionUrl(urlString) {
  const url = new URL(urlString);
  return {
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
    multipleStatements: true,
  };
}

const connection = connectionUrl
  ? mysql.createConnection(parseConnectionUrl(connectionUrl))
  : mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "Arthur2003.",
      database: process.env.DB_NAME || "ecorecicla",
      multipleStatements: true,
    });

function initializeSchema() {
  const schemaPath = path.join(__dirname, "../../db/database.sql");
  const schemaSql = fs
    .readFileSync(schemaPath, "utf8")
    .replace(/^CREATE DATABASE IF NOT EXISTS ecorecicla;\s*/i, "")
    .replace(/^USE ecorecicla;\s*/i, "");

  connection.query(schemaSql, (err) => {
    if (err) {
      console.error("Erro ao inicializar schema:", err);
    } else {
      console.log("Schema do banco inicializado");
    }
  });
}

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco:", err);
  } else {
    console.log("Banco conectado");
    initializeSchema();
  }
});

module.exports = connection;