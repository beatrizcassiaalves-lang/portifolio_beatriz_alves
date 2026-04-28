# 🔍 WhereAmI - Plataforma de Investigação OSINT

## 📝 Descrição do Projeto
O **WhereAmI** é uma plataforma profissional de inteligência de fontes abertas (OSINT) projetada para mapear pegadas digitais e identidades online em tempo real. O sistema utiliza o poder da Inteligência Artificial (Google Gemini) para varrer mais de 500 plataformas globais, identificando a presença de nomes de usuário e endereços de email de forma instantânea.

O objetivo do projeto é mitigar a complexidade de investigações manuais, oferecendo uma interface centralizada onde analistas e usuários podem descobrir padrões de identidade digital. O sistema conta com integração completa ao Firebase para gestão de histórico, autenticação segura e exportação de relatórios detalhados em PDF.

http://googleusercontent.com/image_generation_content/0
*Figura 1: Interface principal do WhereAmI realizando mapeamento de identidade digital.*

## 🚀 Tecnologias Utilizadas
* **Linguagem:** TypeScript
* **Frontend:** React 18, Vite, Tailwind CSS
* **Backend & Cloud:** Firebase (Authentication, Cloud Firestore, Cloud Storage, Analytics)
* **IA Engine:** Google Gemini API (Modelos Pro e Flash)
* **Bibliotecas:** Framer Motion (Animações), jsPDF (Geração de documentos), Lucide React (Icons)

## 📊 Resultados e Aprendizados
O projeto demonstra a eficácia da união entre IA e ferramentas de busca em massa, alcançando performance e precisão elevadas.
* **Buscas em Tempo Real:** Implementação de processamento paralelo que retorna resultados em menos de 3 segundos.
* **Persistência de Dados:** Aprendi a estruturar regras de segurança no Firestore para proteger o histórico privado de cada usuário.
* **Automação de Relatórios:** Desenvolvi um pipeline que gera PDFs dinâmicos, faz o upload para o Cloud Storage e disponibiliza o link de download de forma segura.
* **UX/UI Reversa:** Adaptação do design para garantir visibilidade e usabilidade tanto em fluxos de investigação quanto em navegação casual.

![Gráfico de Performance e Métricas](https://via.placeholder.com/800x400/0f52ba/ffffff?text=Métricas+de+Busca+OSINT)
*Figura 2: Análise de cobertura e tempo de resposta da plataforma.*

## 🔧 Como Executar
1. Clone o repositório.
2. Instale as dependências: `npm install`.
3. Configure o arquivo `.env` com sua `GEMINI_API_KEY`.
4. Configure as credenciais do Firebase em `firebase-applet-config.json`.
5. Execute o comando: `npm run dev`.

![Demonstração do Fluxo de Dados](https://via.placeholder.com/800x300/b3ebf2/0f172a?text=Workflow+de+Investigação+OSINT)
*Figura 3: Representação visual do pipeline de busca e geração de relatórios.*

---
[Voltar ao início](https://github.com/seu-usuario)
