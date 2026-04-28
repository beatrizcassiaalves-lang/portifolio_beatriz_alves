# 🔍 WhatsMyName App - Plataforma de OSINT Profissional

## 📝 Descrição do Projeto
Este projeto é uma plataforma avançada de **OSINT (Open Source Intelligence)** projetada para investigações digitais e mapeamento de identidade. O objetivo principal é automatizar a descoberta de perfis em centenas de redes sociais e realizar análises de pegadas digitais a partir de nomes de usuário ou e-mails.

Desenvolvido para simplificar o trabalho de analistas de segurança e investigadores, o sistema utiliza o modelo **Gemini 3.1 Pro** com **Google Search Grounding** para realizar varreduras em tempo real em mais de 500 plataformas. A interface foi construída com foco na experiência do usuário, utilizando uma estética *Glassmorphism* moderna que permite a visualização instantânea de resultados conforme a pesquisa é realizada.


## 🚀 Tecnologias Utilizadas
* **Framework:** React 19 (Vite)
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS 4.0
* **Inteligência Artificial:** Gemini 3.1 Pro API (Google Generative AI)
* **Animações:** Framer Motion
* **Iconografia:** Lucide React

## 📊 Resultados e Aprendizados
O projeto demonstra como a IA Generativa pode ser aplicada para otimizar processos de coleta de dados públicos de forma ética e eficiente.
* **Escaneamento Multi-Plataforma:** Implementação de um motor que correlaciona dados de mais de 500 sites em segundos.
* **Live Discovery:** Aprendi a implementar técnicas de *debounce* e estados assíncronos para fornecer resultados enquanto o usuário digita.
* **Deep Identity Mapping:** O sistema alcançou alta precisão na identificação de perfis legítimos, filtrando falsos positivos através de análise de IA.

## 🔧 Como Executar
1. Clone o repositório para sua máquina local.
2. Adicione sua chave de API no arquivo `.env`:
   `VITE_GEMINI_API_KEY=sua_chave_aqui`
3. Instale as dependências: `npm install`.
4. Inicie o servidor de desenvolvimento: `npm run dev`.


---
[Voltar ao início](https://github.com/seu-usuario)
