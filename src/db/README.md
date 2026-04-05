# Banco de Dados EcoRecicla

## Configuração

### Credenciais de Acesso
As configurações de conexão estão no arquivo:
`src/backend/config/db.js`

```javascript
const mysql = require("mysql2");

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