# 7. Conclusão

---

## 7.1 Síntese dos Resultados

O EcoRecicla foi desenvolvido com o objetivo de resolver um problema concreto: a dificuldade que pessoas interessadas em reciclar enfrentam para encontrar pontos de coleta adequados e a ausência de incentivos que tornem a prática contínua e engajante.

A plataforma entregue resolve esse problema de forma direta. Qualquer usuário cadastrado pode localizar pontos de coleta em um mapa interativo, registrar suas reciclagens informando o tipo e a quantidade de material, e acompanhar em tempo real o impacto ambiental das suas ações — incluindo CO₂ evitado, água economizada e eco-pontos acumulados. O sistema de gamificação, com níveis progressivos (Semente → Broto → Árvore → Floresta → Guardião), ranking público entre usuários e conquistas desbloqueáveis por metas atingidas, transforma a reciclagem em uma atividade com senso de evolução e comunidade.

O projeto está diretamente alinhado à *ODS 12 — Consumo e Produção Responsáveis*, da Organização das Nações Unidas, tanto na proposta quanto na implementação. A plataforma educa o usuário sobre o impacto ambiental de cada material reciclado, organiza e divulga pontos de coleta que antes estavam dispersos e sem visibilidade, e estimula comportamentos sustentáveis por meio de tecnologia e participação coletiva.

Os principais impactos positivos gerados pela solução são:

- *Acesso à informação:* usuários passam a saber exatamente onde descartar cada tipo de material reciclável, com visualização georreferenciada dos pontos de coleta cadastrados.
- *Consciência ambiental:* cada registro de reciclagem exibe dados calculados de CO₂ evitado e água economizada, tornando o impacto tangível para o usuário.
- *Engajamento sustentado:* o sistema de pontos, níveis e ranking incentiva a reciclagem contínua, e não apenas esporádica.
- *Validação de usabilidade:* o teste SUS aplicado com 5 participantes resultou em uma média de *80,5 pontos, classificada como **Excelente (Nível A)*, confirmando que a solução é funcional, acessível e bem recebida pelo público-alvo.

---

## 7.2 Limitações e Trabalhos Futuros

Durante o desenvolvimento do EcoRecicla, algumas limitações técnicas e de escopo foram identificadas:

*Limitações técnicas:*

- *Autenticação simplificada:* o sistema utiliza tokens gerados no formato token_{id}_{timestamp}, armazenados no localStorage. Essa abordagem atende ao escopo do projeto, mas não segue as melhores práticas de segurança de produção, como o uso de JWT (JSON Web Tokens) com expiração controlada no servidor.
- *Newsletter sem agendamento automático:* o disparo do boletim semanal foi implementado como um endpoint manual (POST /api/notifications/dispatch-newsletter). Em produção, esse processo deveria ser automatizado via cron job ou serviço de fila de mensagens, eliminando a necessidade de chamada manual.
- *Ausência de geolocalização automática:* o mapa de pontos de coleta exige que o usuário navegue manualmente até a sua região. A plataforma ainda não utiliza a API de geolocalização do navegador para sugerir pontos próximos automaticamente.
- *Estatísticas globais parcialmente estáticas:* o campo recycled retornado pelo endpoint /api/stats utiliza um valor fixo de 2.300.000 kg. Os dados reais de reciclagem por usuário são corretamente calculados, mas a métrica global ainda não consolida o total real de todos os registros do banco.
- *Interface não otimizada para mobile:* embora o CSS aplique responsividade básica, a experiência em dispositivos móveis não foi validada com profundidade, especialmente em telas menores que 360px.

*Trabalhos futuros — Versão 2.0:*

- *Aplicativo mobile nativo:* desenvolver versões para Android e iOS usando React Native, aproveitando a lógica de negócio já construída na API REST.
- *Geolocalização automática:* integrar a Geolocation API do navegador para exibir pontos de coleta ordenados por proximidade real do usuário.
- *Autenticação robusta:* migrar para JWT com refresh token, armazenamento em cookie httpOnly e validação server-side, aumentando a segurança do sistema.
- *Agendamento de coletas aprimorado:* a estrutura de collection_schedules já existe no banco, mas a interface para agendamento pode ser expandida com lembretes por e-mail e integração com calendário.
- *Dashboard administrativo:* criar um painel para gestores de pontos de coleta acompanharem volume de descartes, materiais mais reciclados e usuários mais ativos em sua região.
- *Integração com sistemas de pontuação real:* permitir que pontos eco sejam resgatados por benefícios reais, como descontos em parceiros comerciais, aumentando o valor percebido da plataforma.
- *Notificações push:* substituir o sistema atual de notificações in-app por notificações push no navegador via Web Push API, aumentando o alcance dos comunicados.

---

## 7.3 Lições Aprendidas

Trabalhar no EcoRecicla como uma Software House utilizando a metodologia de Fatias Verticais foi uma experiência que combinou aprendizado técnico intenso com desafios reais de colaboração em equipe.

*Sobre a metodologia de Fatias Verticais:*
A abordagem de entregar funcionalidades completas — do banco de dados até a interface — em cada sprint foi desafiadora no início, pois exigiu que cada integrante compreendesse o fluxo completo da aplicação, não apenas sua camada de atuação. Com o tempo, essa visão sistêmica foi o que mais contribuiu para a qualidade do produto: ao entender como o front-end consome a API e como a API consulta o banco, cada desenvolvedor tomou decisões mais conscientes e coerentes com o sistema como um todo.

*Desafios técnicos e como foram superados:*

- *Integração front-end e back-end:* o maior desafio inicial foi fazer o React se comunicar corretamente com o Express. A definição clara dos endpoints no arquivo api.js — centralizando todas as chamadas fetch em um único módulo de serviços — foi a decisão que resolveu esse problema e facilitou a manutenção ao longo do projeto.
- *Banco de dados e modelagem:* a criação das tabelas com os relacionamentos corretos (especialmente entre users, notifications, recycling_logs e collection_points) exigiu várias revisões. A lição aprendida foi que uma modelagem bem planejada desde o início evita retrabalho significativo nas sprints seguintes.
- *Versionamento com Git:* conflitos de merge foram frequentes nas primeiras semanas, especialmente em arquivos como App.jsx e UserSettings.jsx, que concentravam código de múltiplos integrantes. A equipe adotou a prática de criar branches por funcionalidade e realizar pull requests antes de integrar ao branch principal, o que reduziu consideravelmente os conflitos.
- *CORS e ambiente local:* a configuração do CORS no back-end para permitir requisições do front-end rodando em portas diferentes (Vite na 5173, Express na 3001) foi um obstáculo recorrente que ajudou a entender profundamente como funciona a comunicação entre domínios em aplicações web.
- *Gamificação e cálculo de impacto ambiental:* definir os fatores de CO₂ e água por material exigiu pesquisa e validação dos dados utilizados. Essa etapa mostrou que boas decisões técnicas muitas vezes dependem de conhecimento de domínio, não apenas de programação.

No geral, o EcoRecicla representou a consolidação prática de conceitos estudados ao longo do semestre — arquitetura cliente-servidor, banco de dados relacional, API REST, componentes React, versionamento colaborativo — aplicados em um sistema funcional com propósito ambiental real.