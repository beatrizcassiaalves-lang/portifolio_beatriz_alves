# LinguaConnect — Mobile App Interface Design

## Brand Identity
- **Primary Color:** #4169E1 (Royal Blue)
- **Accent:** #6C8EF5 (Light Blue)
- **Background Light:** #F0F4FF
- **Background Dark:** #0D1117
- **Surface Light:** #FFFFFF
- **Surface Dark:** #1A1F2E
- **Success:** #22C55E
- **Warning:** #F59E0B
- **Error:** #EF4444
- **Text Primary Light:** #0F172A
- **Text Primary Dark:** #E2E8F0

## Screen List

1. **Onboarding / Welcome** — Apresentação do app, seleção de idioma e nível
2. **Home (Dashboard)** — Progresso diário, streak, acesso rápido às funcionalidades
3. **Trilhas (Learning Paths)** — Lista de trilhas adaptativas por nível e idioma
4. **Trilha Detalhe** — Módulos, vídeo-aulas e exercícios de uma trilha específica
5. **Vídeo-aula** — Player de vídeo com controles e anotações
6. **Exercício** — Quiz, fill-in-the-blank, matching
7. **Conversa (Connect)** — Matching aleatório com outro estudante via Jitsi Meet
8. **Sala Jitsi** — Tela de videochamada integrada com Jitsi Meet WebView
9. **Vida Real (Real Life)** — Simulações de situações cotidianas
10. **Simulação Detalhe** — Diálogo interativo de simulação
11. **Pronúncia (Pronunciation)** — Treino de pronúncia com gravação e feedback
12. **Perfil** — Dados do usuário, idiomas, conquistas e configurações
13. **Conquistas** — Badges e recompensas por progresso
14. **Configurações** — Idioma, notificações, tema

## Primary Content and Functionality

### Home (Dashboard)
- Saudação personalizada com nome do usuário
- Streak diário (dias consecutivos de estudo)
- Progresso semanal em barras
- Cards de acesso rápido: Trilhas, Conversar, Vida Real, Pronúncia
- Próxima lição recomendada

### Trilhas (Learning Paths)
- FlatList de trilhas com ícone, título, idioma, nível e % de conclusão
- Filtro por idioma (Inglês, Espanhol, Francês, etc.)
- Badge de "Em andamento" e "Concluído"

### Trilha Detalhe
- Header com banner, título e descrição
- Lista de módulos com ícone de status (bloqueado, disponível, concluído)
- Cada módulo tem: vídeo-aula + exercícios

### Vídeo-aula
- Player de vídeo fullscreen com expo-video
- Controles de play/pause, velocidade, legenda
- Botão "Próximo" ao concluir

### Exercício
- Tipos: múltipla escolha, completar frase, ordenar palavras
- Barra de progresso da lição
- Feedback imediato (correto/incorreto) com animação
- XP ganho ao concluir

### Conversa (Connect)
- Botão "Encontrar parceiro" com animação de matching
- Filtro de idioma e nível
- Histórico de conversas anteriores
- Ao encontrar parceiro: abre sala Jitsi

### Sala Jitsi
- WebView com Jitsi Meet embed
- Controles de microfone e câmera sobrepostos
- Timer de sessão
- Botão de encerrar chamada

### Vida Real (Real Life)
- Grid de cenários: restaurante, aeroporto, trabalho, compras, médico
- Cada cenário tem nível de dificuldade e idioma
- Diálogo interativo com personagem virtual

### Pronúncia
- Seletor de frase/palavra para praticar
- Botão de gravação com animação de onda sonora
- Feedback: score de 0-100, destaque de sílabas corretas/incorretas
- Comparação: áudio do usuário vs. áudio nativo

### Perfil
- Avatar, nome, idioma nativo e idiomas em aprendizado
- Estatísticas: lições concluídas, horas estudadas, XP total
- Seção de conquistas (badges)

## Key User Flows

### Flow 1: Estudar uma lição
Home → Trilhas → Trilha Detalhe → Módulo → Vídeo-aula → Exercício → Feedback → Home (XP atualizado)

### Flow 2: Conversar com parceiro
Home → Conversa → Tap "Encontrar Parceiro" → Matching animado → Sala Jitsi (WebView) → Encerrar → Avaliação da sessão

### Flow 3: Praticar pronúncia
Home → Pronúncia → Selecionar frase → Gravar → Ver feedback → Tentar novamente ou próxima frase

### Flow 4: Simulação Vida Real
Home → Vida Real → Selecionar cenário → Diálogo interativo → Resultado e pontuação

## Color Choices
- **Royal Blue #4169E1** — Cor primária, botões principais, ícones ativos
- **Light Blue #6C8EF5** — Gradientes, elementos secundários
- **Indigo #3730A3** — Headers, elementos de destaque
- **Mint Green #10B981** — Sucesso, streaks, progresso
- **Amber #F59E0B** — XP, conquistas, avisos
- **Coral #EF4444** — Erros, alertas

## Navigation Structure
Bottom Tab Bar com 4 abas:
1. 🏠 Home
2. 📚 Trilhas
3. 💬 Conversar
4. 👤 Perfil

Modal screens: Vídeo-aula, Exercício, Sala Jitsi, Simulação, Pronúncia
