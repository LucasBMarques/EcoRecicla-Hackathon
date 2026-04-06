# Como Rodar o EcoRecicla

Este guia mostra como iniciar o projeto localmente (backend + frontend + banco).

## 1. Pre-requisitos

- Node.js 18+ instalado
- MySQL Server 8+ instalado e em execução
- NPM (vem com Node.js)

## 2. Configurar banco de dados

O backend usa estas credenciais em src/backend/config/db.js:

- host: localhost
- user: SEU_USUARIO_MYSQL
- password: SUA_SENHA_MYSQL
- database: ecorecicla

Se seu usuário/senha do MySQL forem diferentes, ajuste o arquivo src/backend/config/db.js.

### Criar estrutura e dados iniciais

Opção A: MySQL Workbench
1. Abra o arquivo src/db/database.sql
2. Execute o script completo

Opção B: Linha de comando (PowerShell)

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u "SEU_USUARIO_MYSQL" -p"SUA_SENHA_MYSQL" < "CAMINHO_DO_PROJETO\src\db\database.sql"
```

## 3. Rodar o backend

No terminal, entre na pasta do backend:

```powershell
cd "CAMINHO_DO_PROJETO\src\backend"
```

Instale dependências:

```powershell
npm install
```

Inicie o servidor:

```powershell
npm start
```

Servidor backend esperado:
- http://localhost:3001
- Health check: http://localhost:3001/health

## 4. Rodar o frontend

Abra outro terminal e entre na pasta do frontend:

```powershell
cd "CAMINHO_DO_PROJETO\src\frontend"
```

Instale dependências:

```powershell
npm install
```

Inicie em modo desenvolvimento:

```powershell
npm run dev
```

Abra a URL mostrada no terminal do Vite (normalmente):
- http://localhost:5173

## 5. Verificação rápida

- Backend responde em /health
- Frontend abre no navegador
- Cadastro/login funcionando
- Materiais aparecem na tela de registrar reciclagem

## 6. Problemas comuns

### Erro de conexão com banco
- Verifique usuário/senha em src/backend/config/db.js
- Confirme se o serviço MySQL está rodando
- Reexecute src/db/database.sql

### Porta já em uso
- Backend: troque porta em src/backend/server.js
- Frontend: o Vite sugere outra porta automaticamente

### Mudanças não aparecem
- Faça recarregamento forçado no navegador: Ctrl + F5
- Reinicie backend e frontend
