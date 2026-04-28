Link do bubble: https://bubble.io/page?id=beatrizcassiaalves-43601&tab=Design&name=index&type=page
# 💼 Sistema de Gestão de Orçamentos (Bubble.io)
 ## 📝 Descrição do Projeto
Este projeto consiste em uma plataforma de gestão de orçamentos desenvolvida em **Bubble.io**, focada na organização do fluxo comercial entre usuários e clientes. O objetivo principal é oferecer uma estrutura robusta para criação e acompanhamento de propostas, garantindo a integridade dos dados e a segurança da informação através de regras de privacidade rigorosas.
 
Desenvolvido como um laboratório de arquitetura No-Code, o sistema foi estruturado para mitigar o risco de *vendor lock-in*. Para isso, utiliza um mapeamento relacional de entidades (User, Cliente, Orçamento e Itens) e uma estratégia de saída documentada que permite a migração futura para stacks tradicionais como Node.js e React, utilizando a Data API para exportação de ativos.
 
 ## 🚀 Tecnologias Utilizadas
* **Plataforma Principal:** Bubble.io (No-Code/Low-Code)
* **Arquitetura de Dados:** PostgreSQL (Conceitual) e Option Sets para estados globais
* **Integração e Exportação:** Data API (REST/JSON)
 ## 📊 Resultados e Aprendizados
O projeto demonstrou que é possível construir sistemas complexos em No-Code mantendo padrões de engenharia de software profissionais.
* **Escalabilidade em Consultas:** Aprendi a evitar o uso de listas longas dentro de campos (que causam lentidão acima de 100 registros), optando pelo uso de chaves estrangeiras (FK) para relacionamentos entre Cliente e Orçamento.
* **Segurança e Privacidade:** Implementei *Privacy Rules* específicas onde apenas o criador do dado possui permissão de visualização e busca, protegendo informações sensíveis de clientes e valores.
* **Documentação de Lógica:** Utilizei o recurso de *Notes* nos Workflows para transformar lógica visual em especificações técnicas, facilitando futuras manutenções e migrações de código.
 
 ## 🔧 Como Executar
1. Acesse o editor do Bubble através do link do projeto.
2. Em **Settings > API**, habilite a "Data API" para os tipos de dados desejados.
3. Explore os **Option Sets** (Status do Orçamento e Unidades) para entender a padronização do sistema.
 
 
---