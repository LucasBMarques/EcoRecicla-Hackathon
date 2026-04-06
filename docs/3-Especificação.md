
# 3. Especificações do Projeto


# 3.1 Requisitos Funcionais

## Tabela de Requisitos Funcionais

| ID    | Descrição do Requisito | Prioridade |
|-------|------------------------|------------|
| RF-01 | O sistema deve permitir que os usuários criem uma conta informando nome, e-mail, senha e endereço. | 🔴 ALTA |
| RF-02 | O sistema deve validar se o e-mail já está cadastrado antes de criar uma nova conta. | 🔴 ALTA |
| RF-03 | O sistema deve validar os campos obrigatórios antes de permitir o cadastro. | 🔴 ALTA |
| RF-04 | O sistema deve armazenar os dados do usuário no banco de dados. | 🔴 ALTA |
| RF-05 | O sistema deve exibir uma mensagem de sucesso após o cadastro. | 🟡 MÉDIA |
| RF-06 | O sistema deve exibir mensagens de erro em caso de dados inválidos. | 🟡 MÉDIA |
| RF-07 | O sistema deve permitir que o usuário visualize uma prévia dos dados antes de finalizar o cadastro. | 🟡 MÉDIA |
| RF-08 | O sistema deve permitir que o usuário altere os dados antes de confirmar o cadastro. | 🟡 MÉDIA |
| RF-09 | O sistema deve redirecionar o usuário para a tela de login após o cadastro bem-sucedido. | 🔴 ALTA |


---

# 3.2 Histórias de Usuário

## Histórias do Projeto

---

### História 1 (relacionada ao RF-01)

Como usuário,  
Eu quero me cadastrar no sistema,  
Para que eu possa utilizar a plataforma.

---

### História 2 (relacionada ao RF-02)

Como sistema,  
Eu quero validar se o e-mail já existe,  
Para que evitar contas duplicadas.

---

### História 3 (relacionada ao RF-03)

Como usuário,  
Eu quero receber aviso caso preencha algo errado,  
Para corrigir antes de finalizar o cadastro.

---

### História 4 (relacionada ao RF-04)

Como sistema,
Eu quero salvar os dados do usuário no banco,
Para que ele possa acessar futuramente.

---

### História 5 (relacionada ao RF-05)

Como usuário,
Eu quero receber uma confirmação de cadastro,
Para saber que deu tudo certo.

---

### História 6 (relacionada ao RF-06)

Como usuário,
Eu quero ver mensagens de erro claras,
Para entender o que preciso corrigir.

---

### História 7 (relacionada ao RF-07)

Como usuário,
Eu quero visualizar uma prévia dos meus dados antes de finalizar o cadastro,
Para garantir que todas as informações estejam corretas.

---

### História 8 (relacionada ao RF-08)

Como usuário,
Eu quero poder editar meus dados antes de confirmar o cadastro,
Para corrigir possíveis erros.

---

### História 9 (relacionada ao RF-09)

Como usuário,
Eu quero receber um e-mail de confirmação após o cadastro,
Para validar que minha conta foi criada com sucesso.

---


# 3.3 Requisitos Não Funcionais

## Tabela de Requisitos Não Funcionais

| ID     | Descrição do Requisito | Prioridade |
|--------|------------------------|------------|
| RNF-01 | O sistema deve carregar as páginas em até 3 segundos. | 🟡 MÉDIA |
| RNF-02 | O sistema deve proteger as informações dos clientes por meio de criptografia. | 🔴 ALTA |
| RNF-03 | O sistema deve possuir validação no front-end e back-end. | 🔴 ALTA |
| RNF-04 | A interface deve ser responsiva (funcionar em celular e desktop). | 🟡 MÉDIA |
| RNF-05 | O sistema deve garantir segurança contra entradas inválidas (ex: SQL Injection). | 🔴 ALTA |
| RNF-06 | O sistema deve ser compatível com os principais navegadores (Chrome, Edge, Firefox). | 🟡 MÉDIA |

---

# 3.4 Restrições do Projeto

## Tabela de Restrições

| ID  | Restrição |
|-----|-----------|
| R-01 | O projeto deverá ser entregue até o final do semestre. |
| R-02 | O front-end deve ser desenvolvido utilizando React com Vite. |
| R-03 | O back-end deve ser desenvolvido utilizando Node.js. |
| R-04 | O banco de dados deve ser implementado utilizando MySQL. |
| R-05 | O sistema deve seguir arquitetura cliente-servidor (Front-end + API + Banco). |
| R-06 | O projeto deve ser versionado e gerenciado utilizando GitHub. |
| R-07 | A comunicação entre front-end e back-end deve ser realizada via API REST. |
| R-08 | O sistema deve ser executado em ambiente web (navegador). |

---


> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)
