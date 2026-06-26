
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
| RF-26 | O sistema deve permitir que o usuário registre atividades de reciclagem informando material, quantidade e unidade. | 🔴 ALTA |
| RF-27 | O sistema deve calcular automaticamente o impacto ambiental (CO₂ evitado e água economizada) com base no material reciclado. | 🔴 ALTA |
| RF-28 | O sistema deve atribuir eco_points ao usuário com base na quantidade e tipo de material reciclado. | 🔴 ALTA |
| RF-29 | O sistema deve atualizar automaticamente o nível do usuário conforme os eco_points acumulados. | 🔴 ALTA |
| RF-30 | O sistema deve permitir que o usuário visualize seu histórico de registros de reciclagem. | 🟡 MÉDIA |
| RF-31 | O sistema deve permitir que o usuário edite ou exclua registros de reciclagem. | 🟡 MÉDIA |
| RF-32 | O sistema deve exibir estatísticas individuais de reciclagem do usuário (total de kg, CO₂ evitado, água economizada). | 🟡 MÉDIA |
| RF-33 | O sistema deve permitir o upload de foto como comprovante da atividade de reciclagem. | 🟢 BAIXA |
| RF-34 | O sistema deve conceder conquistas (badges) automaticamente ao usuário quando ele atingir determinadas metas de reciclagem. | 🟡 MÉDIA |
| RF-35 | O sistema deve exibir um ranking com os usuários de maior pontuação de eco_points. | 🔴 ALTA |
| RF-36 | O sistema deve exibir a posição do usuário logado no ranking geral da plataforma. | 🟡 MÉDIA |
| RF-37 | O sistema deve permitir que o usuário agende coletas em pontos de coleta cadastrados, informando data, hora e material. | 🟡 MÉDIA |
| RF-38 | O sistema deve permitir que o usuário acompanhe e atualize o status dos agendamentos (pendente, confirmado, concluído, cancelado). | 🟡 MÉDIA |
| RF-39 | O sistema deve enviar notificações ao usuário quando novos pontos de coleta forem cadastrados. | 🟢 BAIXA |
| RF-40 | O sistema deve permitir que o usuário visualize e marque notificações como lidas. | 🟢 BAIXA |
| RF-41 | O sistema deve exibir estatísticas gerais da plataforma na página inicial (total de usuários, pontos de coleta e materiais reciclados). | 🟡 MÉDIA |
| RF-42 | O sistema deve exibir os pontos de coleta em um mapa interativo com marcadores georreferenciados. | 🔴 ALTA |
| RF-43 | O sistema deve permitir que o usuário utilize sua localização atual para encontrar pontos de coleta próximos. | 🟡 MÉDIA |
| RF-44 | O sistema deve permitir que o usuário atualize sua foto de perfil. | 🟢 BAIXA |
| RF-45 | O sistema deve permitir que o usuário configure suas preferências de notificações e visibilidade no ranking público. | 🟢 BAIXA |
| RF-46 | O sistema deve permitir que o usuário exclua permanentemente sua conta e todos os seus dados. | 🟡 MÉDIA |

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

---

### História 26 (relacionada ao RF-26)

Como usuário,
Quero registrar minha atividade de reciclagem informando o material e a quantidade,
Para acompanhar minha contribuição ambiental.

---

### História 27 (relacionada ao RF-27)

Como usuário,
Quero que o sistema calcule automaticamente o CO₂ evitado e a água economizada ao reciclar,
Para entender o impacto real das minhas ações.

---

### História 28 (relacionada ao RF-28)

Como usuário,
Quero ganhar eco_points ao registrar reciclagens,
Para ser recompensado pelo meu engajamento com o meio ambiente.

---

### História 29 (relacionada ao RF-29)

Como usuário,
Quero que meu nível evolua automaticamente conforme acumulo eco_points,
Para acompanhar minha progressão na plataforma.

---

### História 30 (relacionada ao RF-30)

Como usuário,
Quero visualizar todo o meu histórico de reciclagens,
Para acompanhar minha evolução ao longo do tempo.

---

### História 31 (relacionada ao RF-31)

Como usuário,
Quero poder editar ou excluir registros de reciclagem,
Para corrigir informações lançadas incorretamente.

---

### História 32 (relacionada ao RF-32)

Como usuário,
Quero visualizar minhas estatísticas de reciclagem (kg, CO₂ e água),
Para entender o total do meu impacto ambiental.

---

### História 33 (relacionada ao RF-33)

Como usuário,
Quero anexar uma foto como comprovante da reciclagem realizada,
Para documentar minhas atividades na plataforma.

---

### História 34 (relacionada ao RF-34)

Como usuário,
Quero receber conquistas (badges) automaticamente ao atingir metas de reciclagem,
Para me sentir motivado a continuar contribuindo.

---

### História 35 (relacionada ao RF-35)

Como usuário,
Quero visualizar o ranking com os usuários mais engajados da plataforma,
Para saber quem são os maiores recicladores da comunidade.

---

### História 36 (relacionada ao RF-36)

Como usuário,
Quero ver minha posição atual no ranking geral,
Para saber como estou me saindo em relação aos outros usuários.

---

### História 37 (relacionada ao RF-37)

Como usuário,
Quero agendar uma coleta em um ponto de coleta cadastrado,
Para me organizar e garantir o descarte correto dos materiais.

---

### História 38 (relacionada ao RF-38)

Como usuário,
Quero acompanhar o status dos meus agendamentos e atualizá-los,
Para saber se a coleta foi confirmada, concluída ou cancelada.

---

### História 39 (relacionada ao RF-39)

Como usuário,
Quero receber notificações quando novos pontos de coleta forem adicionados,
Para ficar informado sobre novas opções de descarte próximas a mim.

---

### História 40 (relacionada ao RF-40)

Como usuário,
Quero visualizar minhas notificações e marcá-las como lidas,
Para manter o controle das informações recebidas pela plataforma.

---

### História 41 (relacionada ao RF-41)

Como visitante,
Quero ver estatísticas gerais da plataforma na página inicial,
Para entender o impacto coletivo gerado pela comunidade.

---

### História 42 (relacionada ao RF-42)

Como usuário,
Quero visualizar os pontos de coleta em um mapa interativo,
Para identificar visualmente os locais de descarte disponíveis.

---

### História 43 (relacionada ao RF-43)

Como usuário,
Quero usar minha localização atual para encontrar pontos de coleta próximos,
Para facilitar o descarte correto sem precisar pesquisar manualmente.

---

### História 44 (relacionada ao RF-44)

Como usuário,
Quero atualizar minha foto de perfil,
Para personalizar minha conta na plataforma.

---

### História 45 (relacionada ao RF-45)

Como usuário,
Quero configurar minhas preferências de notificações e visibilidade no ranking,
Para controlar como minha conta aparece para outros usuários.

---

### História 46 (relacionada ao RF-46)

Como usuário,
Quero poder excluir permanentemente minha conta,
Para remover todos os meus dados da plataforma quando desejar.

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
| RNF-16 | O sistema deve exibir o mapa de pontos de coleta utilizando biblioteca de mapas interativos (Leaflet/OpenStreetMap). | 🟡 MÉDIA |
| RNF-17 | O sistema deve suportar upload de imagens com tamanho máximo de 10MB nos formatos JPEG, PNG e WebP. | 🟢 BAIXA |
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
