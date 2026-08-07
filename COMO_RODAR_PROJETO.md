# Como Rodar o EcoRecicla

Este guia mostra como iniciar o projeto localmente (backend + frontend + banco).

## 1. Pre-requisitos

- Node.js 18+ instalado
- MySQL Server 8+ instalado e em execução
- NPM (vem com Node.js)

## 2. Configurar banco de dados

O backend usa variáveis de ambiente, com fallback para desenvolvimento local:

- `DB_HOST`: localhost
- `DB_USER`: SEU_USUARIO_MYSQL
- `DB_PASSWORD`: SUA_SENHA_MYSQL
- `DB_NAME`: ecorecicla

Se seu usuário/senha do MySQL forem diferentes, defina essas variáveis no ambiente.

Para deploy, também defina `PORT` e, se quiser restringir o acesso, `CORS_ORIGIN` com a URL pública do frontend.

Se você optar por um deploy único com o backend servindo o frontend, o frontend pode usar a própria origem atual e não precisa de `VITE_API_URL`.

No Railway, você também pode configurar uma única variável `MYSQL_PRIVATE_URL` ou `DATABASE_URL` apontando para `{{ MySQL.MYSQL_PRIVATE_URL }}`.

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

Antes do build/deploy do frontend, defina `VITE_API_URL` com a URL pública do backend, por exemplo `https://api.seudominio.com`.

Se o frontend for servido pelo mesmo Node do backend, basta buildar o frontend antes de subir o backend.

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

## 7. Deploy no Railway

Use este caminho se quiser publicar sem separar frontend e backend.

1. No Railway, clique em `New Project`.
2. Escolha `GitHub Repository`.
3. Conecte o repositório do EcoRecicla.
4. O Railway vai usar o `package.json` da raiz e executar o build automático.
5. Adicione um banco MySQL no mesmo projeto, usando a opção `Database`.
6. Copie as variáveis do banco para o serviço da aplicação:
	- `DB_HOST`
	- `DB_USER`
	- `DB_PASSWORD`
	- `DB_NAME`
7. Defina `CORS_ORIGIN` com o domínio final do Railway, se quiser restringir acesso.
8. Faça o deploy e aguarde o link público ficar pronto.

### Observação importante

O frontend já foi ajustado para usar a própria URL do serviço em produção, então você não precisa configurar `VITE_API_URL` se for um deploy único com backend servindo o frontend.
