const mysql = require("mysql2");

// Configurações de conexão com o banco de dados
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "C@rol007",
  database: "ecorecicla"
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco:", err);
  } else {
    console.log("Banco conectado");
  }
});

module.exports = connection;