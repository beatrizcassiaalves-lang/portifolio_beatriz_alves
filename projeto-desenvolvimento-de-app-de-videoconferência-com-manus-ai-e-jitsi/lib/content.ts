export interface LearningPath {
  id: string;
  title: string;
  language: string;
  level: "beginner" | "intermediate" | "advanced";
  description: string;
  emoji: string;
  color: string;
  totalModules: number;
  estimatedHours: number;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  emoji: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  type: "video" | "exercise" | "live";
  duration: number; // minutes
  xp: number;
  videoUrl?: string;
  exercises?: Exercise[];
}

export interface Exercise {
  id: string;
  type: "multiple-choice" | "fill-blank" | "word-order";
  question: string;
  options?: string[];
  answer: string;
  translation?: string;
}

export interface RealLifeScenario {
  id: string;
  title: string;
  description: string;
  emoji: string;
  language: string;
  level: "beginner" | "intermediate" | "advanced";
  color: string;
  dialogues: DialogueTurn[];
}

export interface DialogueTurn {
  id: string;
  speaker: "user" | "character";
  characterName?: string;
  text: string;
  translation: string;
  options?: string[];
  correctOption?: number;
}

export interface PronunciationPhrase {
  id: string;
  language: string;
  text: string;
  translation: string;
  phonetic: string;
  difficulty: "easy" | "medium" | "hard";
  audioHint: string;
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: "en-beginner",
    title: "Inglês para Iniciantes",
    language: "Inglês",
    level: "beginner",
    description: "Aprenda os fundamentos do inglês com trilhas adaptativas e exercícios interativos.",
    emoji: "🇺🇸",
    color: "#4169E1",
    totalModules: 4,
    estimatedHours: 12,
    modules: [
      {
        id: "en-beg-m1",
        title: "Saudações e Apresentações",
        description: "Aprenda a se apresentar e cumprimentar pessoas em inglês.",
        emoji: "👋",
        lessons: [
          {
            id: "en-beg-m1-l1",
            title: "Hello & Goodbye",
            type: "video",
            duration: 5,
            xp: 20,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          },
          {
            id: "en-beg-m1-l2",
            title: "Exercício: Saudações",
            type: "exercise",
            duration: 5,
            xp: 30,
            exercises: [
              {
                id: "ex1",
                type: "multiple-choice",
                question: "Como se diz 'Bom dia' em inglês?",
                options: ["Good night", "Good morning", "Good afternoon", "Goodbye"],
                answer: "Good morning",
                translation: "Good morning = Bom dia",
              },
              {
                id: "ex2",
                type: "multiple-choice",
                question: "O que significa 'How are you?'",
                options: ["Onde você está?", "Quem é você?", "Como você está?", "O que você quer?"],
                answer: "Como você está?",
                translation: "How are you? = Como você está?",
              },
              {
                id: "ex3",
                type: "fill-blank",
                question: "My ___ is John. (Meu nome é John.)",
                options: ["age", "name", "job", "city"],
                answer: "name",
                translation: "My name is John.",
              },
              {
                id: "ex4",
                type: "multiple-choice",
                question: "Como se diz 'Tchau' em inglês?",
                options: ["Hello", "Hi", "Goodbye", "Please"],
                answer: "Goodbye",
                translation: "Goodbye = Tchau / Adeus",
              },
            ],
          },
        ],
      },
      {
        id: "en-beg-m2",
        title: "Números e Cores",
        description: "Aprenda números de 1 a 100 e as cores básicas.",
        emoji: "🔢",
        lessons: [
          {
            id: "en-beg-m2-l1",
            title: "Numbers 1-20",
            type: "video",
            duration: 6,
            xp: 20,
          },
          {
            id: "en-beg-m2-l2",
            title: "Exercício: Números",
            type: "exercise",
            duration: 5,
            xp: 30,
            exercises: [
              {
                id: "ex5",
                type: "multiple-choice",
                question: "Como se diz '5' em inglês?",
                options: ["Four", "Six", "Five", "Seven"],
                answer: "Five",
                translation: "Five = 5",
              },
              {
                id: "ex6",
                type: "multiple-choice",
                question: "O que significa 'Red'?",
                options: ["Azul", "Verde", "Amarelo", "Vermelho"],
                answer: "Vermelho",
                translation: "Red = Vermelho",
              },
              {
                id: "ex7",
                type: "fill-blank",
                question: "The sky is ___. (O céu é azul.)",
                options: ["red", "green", "blue", "yellow"],
                answer: "blue",
                translation: "The sky is blue.",
              },
            ],
          },
        ],
      },
      {
        id: "en-beg-m3",
        title: "Família e Relacionamentos",
        description: "Vocabulário sobre família e como falar sobre seus parentes.",
        emoji: "👨‍👩‍👧‍👦",
        lessons: [
          {
            id: "en-beg-m3-l1",
            title: "Family Members",
            type: "video",
            duration: 7,
            xp: 20,
          },
          {
            id: "en-beg-m3-l2",
            title: "Exercício: Família",
            type: "exercise",
            duration: 5,
            xp: 30,
            exercises: [
              {
                id: "ex8",
                type: "multiple-choice",
                question: "Como se diz 'mãe' em inglês?",
                options: ["Father", "Sister", "Mother", "Brother"],
                answer: "Mother",
                translation: "Mother = Mãe",
              },
              {
                id: "ex9",
                type: "multiple-choice",
                question: "O que significa 'brother'?",
                options: ["Irmã", "Primo", "Irmão", "Pai"],
                answer: "Irmão",
                translation: "Brother = Irmão",
              },
            ],
          },
        ],
      },
      {
        id: "en-beg-m4",
        title: "Aula ao Vivo",
        description: "Pratique com um parceiro em uma aula ao vivo.",
        emoji: "🎥",
        lessons: [
          {
            id: "en-beg-m4-l1",
            title: "Conversa ao Vivo",
            type: "live",
            duration: 20,
            xp: 50,
          },
        ],
      },
    ],
  },
  {
    id: "es-beginner",
    title: "Espanhol para Iniciantes",
    language: "Espanhol",
    level: "beginner",
    description: "Comece sua jornada no espanhol com lições práticas e imersivas.",
    emoji: "🇪🇸",
    color: "#E14141",
    totalModules: 3,
    estimatedHours: 10,
    modules: [
      {
        id: "es-beg-m1",
        title: "Hola! Primeiras Palavras",
        description: "Aprenda as primeiras palavras e frases em espanhol.",
        emoji: "🌟",
        lessons: [
          {
            id: "es-beg-m1-l1",
            title: "Hola y Adiós",
            type: "video",
            duration: 5,
            xp: 20,
          },
          {
            id: "es-beg-m1-l2",
            title: "Exercício: Saudações",
            type: "exercise",
            duration: 5,
            xp: 30,
            exercises: [
              {
                id: "es-ex1",
                type: "multiple-choice",
                question: "Como se diz 'Olá' em espanhol?",
                options: ["Adiós", "Hola", "Gracias", "Por favor"],
                answer: "Hola",
                translation: "Hola = Olá",
              },
              {
                id: "es-ex2",
                type: "multiple-choice",
                question: "O que significa '¿Cómo estás?'",
                options: ["Como você se chama?", "Como você está?", "Onde você mora?", "Quantos anos você tem?"],
                answer: "Como você está?",
                translation: "¿Cómo estás? = Como você está?",
              },
            ],
          },
        ],
      },
      {
        id: "es-beg-m2",
        title: "Números y Colores",
        description: "Aprenda números e cores em espanhol.",
        emoji: "🎨",
        lessons: [
          {
            id: "es-beg-m2-l1",
            title: "Los Números",
            type: "video",
            duration: 6,
            xp: 20,
          },
          {
            id: "es-beg-m2-l2",
            title: "Exercício: Números",
            type: "exercise",
            duration: 5,
            xp: 30,
            exercises: [
              {
                id: "es-ex3",
                type: "multiple-choice",
                question: "Como se diz '3' em espanhol?",
                options: ["Uno", "Dos", "Tres", "Cuatro"],
                answer: "Tres",
                translation: "Tres = 3",
              },
            ],
          },
        ],
      },
      {
        id: "es-beg-m3",
        title: "Aula ao Vivo",
        description: "Pratique espanhol com um parceiro nativo.",
        emoji: "🎥",
        lessons: [
          {
            id: "es-beg-m3-l1",
            title: "Conversa ao Vivo",
            type: "live",
            duration: 20,
            xp: 50,
          },
        ],
      },
    ],
  },
  {
    id: "fr-beginner",
    title: "Francês para Iniciantes",
    language: "Francês",
    level: "beginner",
    description: "Aprenda o idioma do amor com trilhas adaptativas.",
    emoji: "🇫🇷",
    color: "#41A1E1",
    totalModules: 3,
    estimatedHours: 10,
    modules: [
      {
        id: "fr-beg-m1",
        title: "Bonjour! Primeiros Passos",
        description: "Aprenda as primeiras palavras e frases em francês.",
        emoji: "🗼",
        lessons: [
          {
            id: "fr-beg-m1-l1",
            title: "Bonjour et Au Revoir",
            type: "video",
            duration: 5,
            xp: 20,
          },
          {
            id: "fr-beg-m1-l2",
            title: "Exercício: Saudações",
            type: "exercise",
            duration: 5,
            xp: 30,
            exercises: [
              {
                id: "fr-ex1",
                type: "multiple-choice",
                question: "Como se diz 'Bom dia' em francês?",
                options: ["Bonsoir", "Bonjour", "Bonne nuit", "Au revoir"],
                answer: "Bonjour",
                translation: "Bonjour = Bom dia / Olá",
              },
            ],
          },
        ],
      },
      {
        id: "fr-beg-m2",
        title: "Les Nombres",
        description: "Aprenda os números em francês.",
        emoji: "🔢",
        lessons: [
          {
            id: "fr-beg-m2-l1",
            title: "Les Nombres 1-10",
            type: "video",
            duration: 5,
            xp: 20,
          },
        ],
      },
      {
        id: "fr-beg-m3",
        title: "Aula ao Vivo",
        description: "Pratique francês com um parceiro.",
        emoji: "🎥",
        lessons: [
          {
            id: "fr-beg-m3-l1",
            title: "Conversa ao Vivo",
            type: "live",
            duration: 20,
            xp: 50,
          },
        ],
      },
    ],
  },
  {
    id: "en-intermediate",
    title: "Inglês Intermediário",
    language: "Inglês",
    level: "intermediate",
    description: "Avance seu inglês com gramática, vocabulário e conversação.",
    emoji: "🇬🇧",
    color: "#6C41E1",
    totalModules: 4,
    estimatedHours: 16,
    modules: [
      {
        id: "en-int-m1",
        title: "Tempos Verbais",
        description: "Domine os principais tempos verbais do inglês.",
        emoji: "⏰",
        lessons: [
          {
            id: "en-int-m1-l1",
            title: "Present Perfect",
            type: "video",
            duration: 8,
            xp: 25,
          },
          {
            id: "en-int-m1-l2",
            title: "Exercício: Present Perfect",
            type: "exercise",
            duration: 7,
            xp: 35,
            exercises: [
              {
                id: "int-ex1",
                type: "multiple-choice",
                question: "Which sentence uses Present Perfect correctly?",
                options: [
                  "I go to Paris last year.",
                  "I have been to Paris.",
                  "I was go to Paris.",
                  "I going to Paris.",
                ],
                answer: "I have been to Paris.",
                translation: "I have been to Paris. = Eu já fui a Paris.",
              },
              {
                id: "int-ex2",
                type: "fill-blank",
                question: "She ___ already finished her homework. (Ela já terminou a lição.)",
                options: ["have", "has", "had", "is"],
                answer: "has",
                translation: "She has already finished her homework.",
              },
            ],
          },
        ],
      },
      {
        id: "en-int-m2",
        title: "Vocabulário Avançado",
        description: "Expanda seu vocabulário com palavras do cotidiano.",
        emoji: "📚",
        lessons: [
          {
            id: "en-int-m2-l1",
            title: "Idioms & Expressions",
            type: "video",
            duration: 8,
            xp: 25,
          },
        ],
      },
      {
        id: "en-int-m3",
        title: "Conversação Avançada",
        description: "Pratique conversação em situações do dia a dia.",
        emoji: "💬",
        lessons: [
          {
            id: "en-int-m3-l1",
            title: "Business English",
            type: "video",
            duration: 10,
            xp: 30,
          },
        ],
      },
      {
        id: "en-int-m4",
        title: "Aula ao Vivo",
        description: "Aula ao vivo com parceiro de nível intermediário.",
        emoji: "🎥",
        lessons: [
          {
            id: "en-int-m4-l1",
            title: "Conversa ao Vivo",
            type: "live",
            duration: 30,
            xp: 75,
          },
        ],
      },
    ],
  },
];

export const REAL_LIFE_SCENARIOS: RealLifeScenario[] = [
  {
    id: "restaurant-en",
    title: "No Restaurante",
    description: "Peça comida e bebida em inglês",
    emoji: "🍽️",
    language: "Inglês",
    level: "beginner",
    color: "#E17641",
    dialogues: [
      {
        id: "r1",
        speaker: "character",
        characterName: "Waiter",
        text: "Good evening! Welcome to The Blue Table. Can I take your order?",
        translation: "Boa noite! Bem-vindo ao The Blue Table. Posso anotar seu pedido?",
      },
      {
        id: "r2",
        speaker: "user",
        text: "",
        translation: "Escolha como responder:",
        options: [
          "Yes, I'd like a burger and a Coke, please.",
          "I want food now!",
          "No speak English.",
        ],
        correctOption: 0,
      },
      {
        id: "r3",
        speaker: "character",
        characterName: "Waiter",
        text: "Great choice! Would you like fries with that?",
        translation: "Ótima escolha! Você gostaria de batatas fritas com isso?",
      },
      {
        id: "r4",
        speaker: "user",
        text: "",
        translation: "Escolha como responder:",
        options: [
          "Yes, please! And can I have extra ketchup?",
          "I don't understand.",
          "What is fries?",
        ],
        correctOption: 0,
      },
      {
        id: "r5",
        speaker: "character",
        characterName: "Waiter",
        text: "Of course! Your order will be ready in about 10 minutes. Enjoy your meal!",
        translation: "Claro! Seu pedido ficará pronto em cerca de 10 minutos. Bom apetite!",
      },
    ],
  },
  {
    id: "airport-en",
    title: "No Aeroporto",
    description: "Navegue pelo aeroporto em inglês",
    emoji: "✈️",
    language: "Inglês",
    level: "beginner",
    color: "#4169E1",
    dialogues: [
      {
        id: "a1",
        speaker: "character",
        characterName: "Agent",
        text: "Good morning! May I see your passport and boarding pass, please?",
        translation: "Bom dia! Posso ver seu passaporte e cartão de embarque, por favor?",
      },
      {
        id: "a2",
        speaker: "user",
        text: "",
        translation: "Escolha como responder:",
        options: [
          "Sure, here you go.",
          "I forgot my passport.",
          "What is boarding pass?",
        ],
        correctOption: 0,
      },
      {
        id: "a3",
        speaker: "character",
        characterName: "Agent",
        text: "Thank you. How many bags are you checking in today?",
        translation: "Obrigado. Quantas malas você está despachando hoje?",
      },
      {
        id: "a4",
        speaker: "user",
        text: "",
        translation: "Escolha como responder:",
        options: [
          "Just one suitcase, please.",
          "Many bags!",
          "I don't know.",
        ],
        correctOption: 0,
      },
    ],
  },
  {
    id: "shopping-en",
    title: "Fazendo Compras",
    description: "Compre roupas e itens em inglês",
    emoji: "🛍️",
    language: "Inglês",
    level: "beginner",
    color: "#41E1A1",
    dialogues: [
      {
        id: "s1",
        speaker: "character",
        characterName: "Shopkeeper",
        text: "Hi there! Can I help you find something?",
        translation: "Olá! Posso ajudá-lo a encontrar algo?",
      },
      {
        id: "s2",
        speaker: "user",
        text: "",
        translation: "Escolha como responder:",
        options: [
          "Yes, I'm looking for a blue shirt in size medium.",
          "No, I'm just looking.",
          "How much does everything cost?",
        ],
        correctOption: 0,
      },
      {
        id: "s3",
        speaker: "character",
        characterName: "Shopkeeper",
        text: "We have a great selection! This one is on sale for $25. Would you like to try it on?",
        translation: "Temos uma ótima seleção! Esta está em promoção por $25. Gostaria de experimentar?",
      },
    ],
  },
  {
    id: "doctor-en",
    title: "No Médico",
    description: "Consulta médica em inglês",
    emoji: "🏥",
    language: "Inglês",
    level: "intermediate",
    color: "#E14169",
    dialogues: [
      {
        id: "d1",
        speaker: "character",
        characterName: "Doctor",
        text: "Good morning! What brings you in today?",
        translation: "Bom dia! O que o traz aqui hoje?",
      },
      {
        id: "d2",
        speaker: "user",
        text: "",
        translation: "Escolha como responder:",
        options: [
          "I've been having a headache and fever for two days.",
          "I feel bad.",
          "I don't know what's wrong.",
        ],
        correctOption: 0,
      },
      {
        id: "d3",
        speaker: "character",
        characterName: "Doctor",
        text: "I see. Let me check your temperature. Can you describe the pain?",
        translation: "Entendo. Deixe-me verificar sua temperatura. Você pode descrever a dor?",
      },
    ],
  },
  {
    id: "work-en",
    title: "No Trabalho",
    description: "Situações profissionais em inglês",
    emoji: "💼",
    language: "Inglês",
    level: "intermediate",
    color: "#6C41E1",
    dialogues: [
      {
        id: "w1",
        speaker: "character",
        characterName: "Colleague",
        text: "Hi! Are you ready for the presentation this afternoon?",
        translation: "Olá! Você está pronto para a apresentação desta tarde?",
      },
      {
        id: "w2",
        speaker: "user",
        text: "",
        translation: "Escolha como responder:",
        options: [
          "Yes, I've been preparing all week. I think it's going to go well.",
          "No, I forgot about it.",
          "What presentation?",
        ],
        correctOption: 0,
      },
    ],
  },
  {
    id: "restaurant-es",
    title: "En el Restaurante",
    description: "Peça comida em espanhol",
    emoji: "🥘",
    language: "Espanhol",
    level: "beginner",
    color: "#E17641",
    dialogues: [
      {
        id: "re1",
        speaker: "character",
        characterName: "Camarero",
        text: "¡Buenas tardes! ¿Qué desea pedir?",
        translation: "Boa tarde! O que deseja pedir?",
      },
      {
        id: "re2",
        speaker: "user",
        text: "",
        translation: "Escolha como responder:",
        options: [
          "Quisiera una paella y un vino tinto, por favor.",
          "No entiendo español.",
          "¿Qué hay en el menú?",
        ],
        correctOption: 0,
      },
    ],
  },
];

export const PRONUNCIATION_PHRASES: PronunciationPhrase[] = [
  {
    id: "p1",
    language: "Inglês",
    text: "The weather is beautiful today.",
    translation: "O tempo está lindo hoje.",
    phonetic: "ðə ˈwɛðər ɪz ˈbjuːtɪfəl təˈdeɪ",
    difficulty: "easy",
    audioHint: "Preste atenção no 'th' em 'the' e 'weather'",
  },
  {
    id: "p2",
    language: "Inglês",
    text: "She sells seashells by the seashore.",
    translation: "Ela vende conchas à beira-mar.",
    phonetic: "ʃiː sɛlz ˈsiːʃɛlz baɪ ðə ˈsiːʃɔːr",
    difficulty: "hard",
    audioHint: "Trava-língua clássico! Foque no som 'sh' vs 's'",
  },
  {
    id: "p3",
    language: "Inglês",
    text: "How are you doing today?",
    translation: "Como você está hoje?",
    phonetic: "haʊ ɑːr juː ˈduːɪŋ təˈdeɪ",
    difficulty: "easy",
    audioHint: "Frase comum do cotidiano",
  },
  {
    id: "p4",
    language: "Inglês",
    text: "I would like to order a coffee, please.",
    translation: "Eu gostaria de pedir um café, por favor.",
    phonetic: "aɪ wʊd laɪk tə ˈɔːrdər ə ˈkɒfi pliːz",
    difficulty: "medium",
    audioHint: "Reduza o 'would' para 'wud' em fala natural",
  },
  {
    id: "p5",
    language: "Inglês",
    text: "The thirty-three thieves thought that they thrilled the throne.",
    translation: "Os trinta e três ladrões pensaram que emocionaram o trono.",
    phonetic: "ðə ˈθɜːti θriː θiːvz θɔːt ðæt ðeɪ θrɪld ðə θrəʊn",
    difficulty: "hard",
    audioHint: "Trava-língua com 'th'! Muito difícil para brasileiros",
  },
  {
    id: "p6",
    language: "Inglês",
    text: "Nice to meet you!",
    translation: "Prazer em conhecê-lo!",
    phonetic: "naɪs tə miːt juː",
    difficulty: "easy",
    audioHint: "Frase básica de apresentação",
  },
  {
    id: "p7",
    language: "Espanhol",
    text: "Buenos días, ¿cómo estás?",
    translation: "Bom dia, como você está?",
    phonetic: "ˈbwenos ˈdias ˈkomo esˈtas",
    difficulty: "easy",
    audioHint: "Atenção ao 'ue' em 'buenos'",
  },
  {
    id: "p8",
    language: "Espanhol",
    text: "Me gustaría una mesa para dos personas.",
    translation: "Eu gostaria de uma mesa para duas pessoas.",
    phonetic: "me ɡustaˈɾia ˈuna ˈmesa ˈpaɾa dos peɾˈsonas",
    difficulty: "medium",
    audioHint: "Atenção ao 'r' suave em 'para' e 'personas'",
  },
  {
    id: "p9",
    language: "Francês",
    text: "Bonjour, comment allez-vous?",
    translation: "Bom dia, como vai você?",
    phonetic: "bɔ̃ʒuʁ kɔmɑ̃ tale vu",
    difficulty: "medium",
    audioHint: "O 'r' francês é gutural, diferente do português",
  },
  {
    id: "p10",
    language: "Francês",
    text: "Je voudrais un café au lait, s'il vous plaît.",
    translation: "Eu gostaria de um café com leite, por favor.",
    phonetic: "ʒə vudʁɛ œ̃ kafe o lɛ sil vu plɛ",
    difficulty: "hard",
    audioHint: "Atenção às vogais nasais e ao 'r' gutural",
  },
];
