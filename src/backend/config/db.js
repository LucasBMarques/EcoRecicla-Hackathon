const mysql = require("mysql2");

// Configurações de conexão com o banco de dados
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
<<<<<<< HEAD
  password: "Arthur2003.",
=======
  password: "Celta2020@",
>>>>>>> ef14d754e4de3c88010de833fe9fa5206b4d633d
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