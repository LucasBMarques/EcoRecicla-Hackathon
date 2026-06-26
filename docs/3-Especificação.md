
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
| RF-10 | O sistema deve permitir que o usuário realize login utilizando e-mail e senha. | 🔴 ALTA |
| RF-11 | O sistema deve validar as credenciais informadas durante o login. | 🔴 ALTA |
| RF-12 | O sistema deve permitir que o usuário encerre a sessão através do logout. | 🟡 MÉDIA |
| RF-13 | O sistema deve listar os pontos de coleta cadastrados. | 🔴 ALTA |
| RF-14 | O sistema deve permitir visualizar detalhes dos pontos de coleta. | 🟡 MÉDIA |
| RF-15 | O sistema deve permitir cadastrar novos pontos de coleta. | 🔴 ALTA |
| RF-16 | O sistema deve permitir editar informações dos pontos de coleta. | 🟡 MÉDIA |
| RF-17 | O sistema deve permitir excluir pontos de coleta cadastrados. | 🟡 MÉDIA |
| RF-18 | O sistema deve exibir os materiais recicláveis aceitos em cada ponto de coleta. | 🔴 ALTA |
| RF-19 | O sistema deve permitir associar materiais recicláveis aos pontos de coleta. | 🔴 ALTA |
| RF-20 | O sistema deve permitir a comunicação entre front-end e back-end por meio de API REST. | 🔴 ALTA |
| RF-21 | O sistema deve armazenar os dados no banco de dados MySQL. | 🔴 ALTA |
| RF-22 | O sistema deve permitir pesquisar pontos de coleta. | 🟡 MÉDIA |
| RF-23 | O sistema deve exibir mensagens de sucesso e erro nas operações realizadas. | 🟡 MÉDIA |
| RF-24 | O sistema deve permitir atualização dos dados do usuário. | 🟡 MÉDIA |
| RF-25 | O sistema deve permitir navegação entre as páginas da aplicação. | 🟡 MÉDIA |
| RF-26 | O sistema deve permitir que o usuário registre uma reciclagem informando material, quantidade e unidade. | 🔴 ALTA |
| RF-27 | sistema deve calcular e exibir em tempo real o impacto ambiental estimado (CO₂, água e pontos) antes de confirmar o registro. | 🔴 ALTA |
| RF-28 |sistema deve salvar o registro de reciclagem e atualizar os totais do perfil do usuário. | 🔴 ALTA | 
| RF-29 | sistema deve permitir que o usuário edite um registro de reciclagem já salvoMÉDIARF-30O sistema deve permitir que o usuário exclua um registro de reciclagem. | 🟡 MÉDIA |
| RF-31 | sistema deve exibir o histórico de reciclagens do usuário em ordem cronológica. | 🔴 ALTA | 
| RF-32 | sistema deve exibir um dashboard com totais acumulados (kg, CO₂, água e pontos) e gráficos de evolução mensal e por material. | 🟡 MÉDIA |
| RF-33 | sistema deve desbloquear conquistas (badges) automaticamente quando o usuário atingir metas de kg, pontos ou número de registros. | 🟡 MÉDIA |
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
Para evitar contas duplicadas.

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
Eu quero ser redirecionado para a tela de login após o cadastro,
Para acessar minha conta no sistema.

---

### História 10 (relacionada ao RF-10)

Como usuário,
Quero realizar login no sistema,
Para acessar minhas funcionalidades.

---

### História 11 (relacionada ao RF-11)

Como sistema,
Quero validar os dados de login,
Para garantir acesso apenas a usuários cadastrados.

---

### História 12 (relacionada ao RF-12)

Como usuário,
Quero realizar logout da plataforma,
Para encerrar minha sessão com segurança.

---

### História 13 (relacionada ao RF-13)

Como usuário,
Quero visualizar os pontos de coleta cadastrados,
Para encontrar locais de reciclagem.

---

### História 14 (relacionada ao RF-14)

Como usuário,
Quero visualizar detalhes dos pontos de coleta,
Para conhecer informações do local.

---

### História 15 (relacionada ao RF-15)

Como administrador,
Quero cadastrar novos pontos de coleta,
Para disponibilizar novos locais no sistema.

---

### História 16 (relacionada ao RF-16)

Como administrador,
Quero editar os dados dos pontos de coleta,
Para manter as informações atualizadas.

---

### História 17 (relacionada ao RF-17)

Como administrador,
Quero remover pontos de coleta,
Para excluir locais desatualizados.

---

### História 18 (relacionada ao RF-18)

Como usuário,
Quero visualizar os materiais recicláveis aceitos,
Para saber onde descartar corretamente.

---

### História 19 (relacionada ao RF-19)

Como administrador,
Quero associar materiais aos pontos de coleta,
Para informar os tipos de reciclagem disponíveis.

---

### História 20 (relacionada ao RF-20)

Como sistema,
Quero integrar front-end e back-end através de API,
Para permitir comunicação entre as partes do sistema.

---

### História 21 (relacionada ao RF-21)

Como sistema,
Quero armazenar os dados no banco MySQL,
Para garantir persistência das informações.

---

### História 22 (relacionada ao RF-22)

Como usuário,
Quero pesquisar pontos de coleta,
Para encontrar locais específicos rapidamente.

---

### História 23 (relacionada ao RF-23)

Como usuário,
Quero receber mensagens de sucesso e erro,
Para entender o resultado das ações realizadas.

---

### História 24 (relacionada ao RF-24)

Como usuário,
Quero atualizar meus dados cadastrais,
Para manter minhas informações corretas.

---

### História 25 (relacionada ao RF-25)

Como usuário,
Quero navegar entre as páginas da aplicação,
Para utilizar os recursos do sistema.

### História 26 (relacionada ao RF-26)

Como usuário,
Quero registrar o que reciclei informando o material e a quantidade,
Para acompanhar minha contribuição ambiental.

---

### História 27 (relacionada ao RF-27)

Como usuário,
Quero ver o impacto estimado antes de confirmar o registro,
Para saber quanto CO₂ e água vou economizar com aquela reciclagem.

---

### História 28 (relacionada ao RF-28)

Como usuário,
Quero poder corrigir ou remover um registro que fiz errado,
Para manter meu histórico correto.

---

### História 29 (relacionada ao RF-29)

Como usuário,
Quero visualizar todo o meu histórico de reciclagens,
Para lembrar do que já reciclei e quando.

---

### História 30 (relacionada ao RF-30)

Como usuário,
Quero ver um painel com meus totais e gráficos de evolução,
Para entender meu impacto acumulado ao longo do tempo.

---

### História 31 (relacionada ao RF-31)

Como usuário,
Quero ganhar conquistas conforme reciclo mais,
Para me sentir motivada a continuar reciclando.

---

### História 32 (relacionada ao RF-32)

Como usuário,
Quero ver meu nível atual no sistema,
Para acompanhar minha evolução como recicladora.

---

### História 33 (relacionada ao RF-33)

Como usuário,
Quero agendar uma coleta de resíduos,
Para organizar o descarte com antecedência.

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
| RNF-07 | O sistema deve utilizar arquitetura cliente-servidor. | 🔴 ALTA |
| RNF-08 | A API deve retornar dados no formato JSON. | 🔴 ALTA |
| RNF-09 | O sistema deve possuir organização modular no back-end. | 🟡 MÉDIA |
| RNF-10 | O sistema deve manter persistência dos dados após reinicialização do servidor. | 🔴 ALTA |
| RNF-11 | O sistema deve garantir integridade dos dados armazenados no banco. | 🔴 ALTA |
| RNF-12 | O sistema deve possuir código versionado utilizando GitHub. | 🟡 MÉDIA |
| RNF-13 | O sistema deve ser desenvolvido utilizando React no front-end. | 🟡 MÉDIA |
| RNF-14 | O sistema deve utilizar Node.js no back-end. | 🟡 MÉDIA |
| RNF-15 | O sistema deve utilizar MySQL como banco de dados. | 🔴 ALTA |
| RNF-16 | O sistema deve exibir o cálculo de impacto em tempo real, sem atraso perceptível ao usuário. | 🔴 ALTA |
| RNF-17 | O sistema deve garantir que os totais do usuário nunca fiquem com valores negativos após edição ou exclusão de registros. | 🔴 ALTA |
| RNF-18 | O sistema deve evitar registros duplicados de conquistas para o mesmo usuário. | 🟡 MÉDIA |
| RNF-19 | O dashboard deve exibir dados dos últimos 6 meses sem necessidade de ação adicional do usuário. | 🟡 MÉDIA |
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
