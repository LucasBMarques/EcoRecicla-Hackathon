# Código-fonte do Projeto — EcoRecicla

Este diretório contém todo o código-fonte da aplicação EcoRecicla, organizado em três módulos principais: **frontend**, **backend** e **banco de dados**.

---

## 📁 Estrutura de Pastas

```
src/
├── frontend/          # Aplicação React (Vite)
│   ├── src/
│   │   ├── pages/     # Telas da aplicação
│   │   ├── components/# Componentes reutilizáveis
│   │   ├── services/  # Comunicação com a API
│   │   ├── hooks/     # Hooks customizados
│   │   └── styles/    # Arquivos CSS por tela
│   ├── index.html
│   └── package.json
├── backend/           # API REST com Node.js + Express
│   ├── config/        # Configuração do banco de dados
│   ├── controllers/   # Lógica de cada rota
│   ├── routes/        # Definição dos endpoints
│   ├── server.js      # Ponto de entrada do servidor
│   └── package.json
└── db/
    └── database.sql   # Script de criação do banco de dados
```

---

## 🖥️ Frontend

Desenvolvido com **React 19 + Vite 8**.

### Páginas (`src/frontend/src/pages/`)

| Arquivo | Rota/Tela | Descrição |
|---|---|---|
| `Login.jsx` | `login` | Tela de autenticação do usuário |
| `Register.jsx` | `register` | Tela de cadastro de novo usuário |
| `Home.jsx` | `home` | Página principal após login |
| `Mapa.jsx` | `mapa` | Mapa interativo com pontos de coleta (Leaflet) |
| `CollectionPoints.jsx` | `collection-points` | Listagem e cadastro de pontos de coleta |
| `RecyclingDashboard.jsx` | `recycling-dashboard` | Dashboard de registros de reciclagem do usuário |
| `UserSettings.jsx` | `settings` | Configurações e perfil do usuário |

### Componentes (`src/frontend/src/components/`)

| Arquivo | Descrição |
|---|---|
| `Navbar.jsx` | Barra de navegação principal |
| `Footer.jsx` | Rodapé da aplicação |
| `Map.jsx` | Componente de mapa (Leaflet) reutilizável |
| `PointModal.jsx` | Modal de detalhes de um ponto de coleta |
| `Toast.jsx` | Componente de notificações visuais (feedback ao usuário) |

### Serviços e Hooks

| Arquivo | Descrição |
|---|---|
| `src/services/api.js` | Funções para comunicação com a API backend (fetch) |
| `src/hooks/useToast.js` | Hook customizado para exibição de notificações |

### Estilos (`src/frontend/src/styles/`)

| Arquivo | Tela relacionada |
|---|---|
| `auth.css` | Páginas de Login e Cadastro |
| `collectionPointsForm.css` | Tela de pontos de coleta |
| `pointModal.css` | Modal de detalhes do ponto |
| `toast.css` | Componente de notificações |
| `userSettings.css` | Tela de configurações do usuário |
| `home.css` | Página Home |

### Dependências principais

| Pacote | Versão | Uso |
|---|---|---|
| `react` | ^19.2.4 | Framework de interface |
| `react-dom` | ^19.2.4 | Renderização no navegador |
| `leaflet` | ^1.9.4 | Mapas interativos |
| `react-leaflet` | ^5.0.0 | Componentes React para Leaflet |
| `vite` | ^8.0.0 | Bundler e servidor de desenvolvimento |

---

## ⚙️ Backend

API REST desenvolvida com **Node.js + Express 5**.

### Rotas disponíveis (`/api/...`)

| Arquivo de Rotas | Prefixo | Funcionalidade |
|---|---|---|
| `authRoutes.js` | `/api` | Cadastro, login, logout e validação de sessão |
| `collectionPointsRoutes.js` | `/api` | CRUD de pontos de coleta |
| `materialsRoutes.js` | `/api` | Listagem de materiais recicláveis |
| `recyclingRoutes.js` | `/api` | Registro e histórico de reciclagem |
| `scheduleRoutes.js` | `/api` | Agendamento de coletas |
| `uploadRoutes.js` | `/api` | Upload de imagens (multer) |
| `homeRoutes.js` | `/api` | Estatísticas gerais (dashboard) |

### Endpoint de saúde

```
GET /health → { "status": "ok" }
```

### Dependências principais

| Pacote | Versão | Uso |
|---|---|---|
| `express` | ^5.2.1 | Framework HTTP |
| `cors` | ^2.8.6 | Liberação de requisições cross-origin |
| `mysql2` | ^3.19.1 | Conexão com banco de dados MySQL |
| `multer` | ^2.1.1 | Upload de arquivos |
| `nodemon` | ^3.1.14 | Reinicialização automática em desenvolvimento |

### Configuração do banco (`src/backend/config/db.js`)

Arquivo responsável pela criação do pool de conexões com o MySQL. As credenciais devem ser configuradas via variáveis de ambiente (`.env`) antes de rodar o projeto.

---

## 🗄️ Banco de Dados

Script localizado em `src/db/database.sql`.

### Tabelas criadas

| Tabela | Descrição |
|---|---|
| `users` | Dados dos usuários cadastrados (nome, e-mail, senha, eco-pontos, nível, etc.) |
| `collection_points` | Pontos de coleta com localização (lat/long), materiais aceitos e horários |
| `material_types` | Tipos de materiais com ícone e cor (uso interno) |
| `materials` | Materiais recicláveis com fatores de CO₂, água e pontos por kg |
| `badges` | Conquistas desbloqueáveis pelos usuários |
| `user_badges` | Relacionamento entre usuários e conquistas obtidas |
| `recycling_logs` | Histórico de registros de reciclagem por usuário |
| `collection_schedules` | Agendamentos de coleta por usuário |

### Dados iniciais incluídos

O script já insere automaticamente:
- **12 tipos de materiais** (Papel, Plástico, Vidro, Metal, Eletrônicos, etc.)
- **6 conquistas (badges)** iniciais

---

## 🖼️ Imagens e Assets

| Caminho | Descrição |
|---|---|
| `src/frontend/src/assets/public/img/imagem-home.png` | Imagem ilustrativa da tela Home |
| `src/frontend/src/assets/public/img/ODS-12.jpg` | Imagem da ODS 12 (Consumo e Produção Responsáveis) |

---

## 🚀 Como rodar o projeto

Consulte o arquivo [`COMO_RODAR_PROJETO.md`](../COMO_RODAR_PROJETO.md) na raiz do repositório para instruções completas de instalação e execução.

**Resumo rápido:**

```bash
# 1. Backend
cd src/backend
npm install
npm run dev        # porta 3001

# 2. Frontend (em outro terminal)
cd src/frontend
npm install
npm run dev        # porta 5173

# 3. Banco de dados
# Importar src/db/database.sql no MySQL Workbench
```
