# 2. Planejamento do Projeto

---

### 🚨 Regra de Ouro: 

> ❗Não existe divisão entre “quem faz documento”, “quem faz Front-end” e “quem faz Back-end”.

<br>Todos os integrantes são **Desenvolvedores Full-Stack** e devem implementar **Fatias Verticais (Vertical Slices)**.

✔️ Cada membro deve entregar a funcionalidade completa:  
**Banco de Dados → API → Tela**

---

# 2.1 Sprints do Projeto

O projeto será realizado em **4 Sprints**, com entregas contínuas de código e documentação, além de um marco focado em usabilidade.

---

## 📅 Visão Geral

### 🟢 Sprint 1 – Setup, Hello World e Visão do Produto
- README com descrição do projeto
- ODS escolhida
- Backlog macro
- Repositório criado
- Banco de dados instanciado (vazio)
- Tela "Hello World" conectada à API

---

### 🟡 Sprint 2 – MVP (Primeira Fatia Vertical)
- Requisitos Funcionais documentados
- Script do Banco de Dados
- 1ª funcionalidade completa funcionando
- Dados sendo salvos no banco

⚠️ Se não salvar no banco, não pontua.

---

### 🔵 Sprint 3 – Core e Regras de Negócio
- Implementação das regras de negócio
- Validações no backend
- DER atualizado via Engenharia Reversa
- Diagrama de Classes atualizado

---

### 🟣 Milestone Específico – Teste de Usabilidade (UX)
- Aplicação do Teste SUS com usuários reais
- Avaliação das telas desenvolvidas nas Sprints 2 e 3
- Preenchimento do Relatório de Usabilidade (Seção 6)

---

### 🔴 Sprint 4 – Finalização e Deploy
- Correção de bugs apontados no Teste de UX e Code Review
- Testes finais ponta a ponta
- Documentação final consolidada
- Relatório preenchido no APC
- Sistema pronto para Arguição

---

# 👥 Papéis de Gestão

Todos programam.  
Os papéis abaixo são apenas para organização do time.

- 👨‍💻 **Tech Lead (Git Master)** Responsável pelo repositório e merges.

- 🗄️ **Arquiteto de Dados (DBA Guard)** Responsável pela modelagem e padronização do banco.

- 🧪 **Gerente de Qualidade (QA & Code Reviewer)** Responsável por revisar código e validar testes de usabilidade.

- 📋 **Facilitador Ágil (PO / Scrum Master)** Responsável por prazos, Kanban e priorização do backlog.

---

##  Definição dos Papéis – Sprint 1

- 👨‍💻 Tech Lead: Lucas Barbosa Marques
- 🗄️ Arquiteto de Dados: Maria Eduarda Botelho
- 🧪 Gerente de Qualidade: Arthur Jorge Soares
- 📋 Facilitador Ágil: Carolina Eller Marinho

> Caso os papéis mudem nas próximas Sprints, atualizar neste documento.

---

# 2.2 Execução e Controle

## 🗂️ Kanban (OBRIGATÓRIO)

O projeto pode utilizar a aba **Projects** do GitHub, porém é **OBRIGATÓRIO preencher os quadros Kanban de cada Sprint** (apresentados abaixo).

### Estrutura obrigatória do Board:

- A Fazer
- Desenvolver
- Fila para Teste
- Teste
- Feito

### Regras

- Cada cartão deve representar uma Fatia Vertical.
- Todo cartão deve conter:
  - Responsável
  - Descrição
  - Prazo
- A avaliação individual considerará:
  - Histórico de commits
  - Movimentação no Kanban

⚠️ Se não está no Git, não foi feito.

---

# 📋 Acompanhamento das Sprints

## Legenda de Status

- [x] ✔️ Concluído
- [ ] 📝 Em andamento
- [ ] ⌛ Atrasado
- [ ] ❌ Não iniciado

---

# 🟢 Sprint 1 – Setup

| Responsável | Papel | Tarefa | Início | Prazo | Status |
|-------------|--------|--------|--------|--------|--------|
|Lucas Barbosa Marques|Tech Lead| Preencher Visão do Produto, ODS e Backlog no README | 06/03 | 13/03 | ✔️ |
|Maria Eduarda Botelho|Arquiteto de Dados| Criar instância do Banco de Dados | 06/03 | 13/03 | ✔️ |
|Carolina Eller Marinho|Facilitador Ágil| Criar repositório e estruturar pastas | 06/03 | 13/03 | ✔️ |
|Arthur Jorge Soares| QA | Criar tela Hello World conectada à API | 06/03 | 13/03 | ✔️ |

---

# 🟡 Sprint 2 – MVP

| Responsável | Papel | Tarefa | Início | Prazo | Status |
|-------------|--------|--------|--------|--------|--------|
|Lucas Barbosa Marques|Tech Lead|Tela de configurações do usuário, tela de login e cadastro| 25/03 | 01/04 | ✔️ |
|Maria Eduarda Botelho|Arquiteto de Dados|Tela principal : Home| 31/03 | 15/05 |📝|
|Carolina Eller Marinho|Facilitador Ágil| Tela de registro de reciclagem e dashboard | 31\03 | 05\04 | ✔️ |
|Arthur Jorge Soares| QA | Tela de cadastro de ponto de coleta|27/03| 03/04 | ✔️ |

# 🟡 Sprint 2 – MVP - ⚙️ Organização e Documentação do Projeto

| Responsável | Papel | Tarefa | Início | Prazo | Status |
|-------------|--------|--------|--------|--------|--------|
|Lucas Barbosa Marques|Tech Lead|Wireframes/Mockups| 20/03 | 24/03 | ✔️ |
|Maria Eduarda Botelho|Arquiteto de Dados|Diagrama de Fluxo| 03/04 | 04/04 |✔️|
|Carolina Eller Marinho|Facilitador Ágil|Quadro de tarefas Kanban| 22/03 | 06/04 | ✔️ |
|Arthur Jorge Soares| QA | Documentação Técnica|27/03| 05/04 | ✔️ |

---

# 🔵 Sprint 3 – Core

| Responsável | Papel | Tarefa | Início | Prazo | Status |
|-------------|--------|--------|--------|--------|--------|
|  Arthur Jorge Soares| QA  | documentação técnica RF e RNF| 06/05 | 09/05 | ✔️ |
| Maria Eduarda Botelho|Arquiteto de Dados  |Engenharia reversa de diagramas | 06/05 | 10/05 | ✔️ |
|Carolina Eller Marinho|Facilitador Ágil   | Quadro de tarefas Kanban| 06/05 | 10/05 | ✔️ |
|  Lucas Barbosa Marques|Tech Lead  | Back-end principais implementação | 16/04 | 23/04 | ❌ |

---

# 🟣 Milestone – Teste de Usabilidade (UX)

| Responsável | Papel | Tarefa | Início | Prazo | Status |
|-------------|--------|--------|--------|--------|--------|
|             |        | Aplicar roteiro de teste com usuários reais | 24/04 | 15/05 | ❌ |
|             |        | Consolidar dados e preencher Seção 6 do template | 16/05 | 22/05 | ❌ |

---

# 🔴 Sprint 4 – Finalização

| Responsável | Papel | Tarefa | Início | Prazo | Status |
|-------------|--------|--------|--------|--------|--------|
|             |        | Correção de bugs de usabilidade e Code Review | 22/05 | 05/06 | ❌ |
|             |        | Finalizar relatórios e dashboards | 01/06 | 15/06 | ❌ |
|             |        | Preencher Relatório APC | 10/06 | 20/06 | ❌ |
|             |        | Testes finais e consolidar README | 15/06 | 25/06 | ❌ |

---

