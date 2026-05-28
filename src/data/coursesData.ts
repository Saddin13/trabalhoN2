import { Course } from '../types';

export const COURSES_DATA: Course[] = [
  {
    id: 'fullstack-nextjs',
    title: 'Fullstack Next.js 15 & React 19 Mastery',
    category: 'programming',
    description: 'Domine a criação de aplicações web ultra-rápidas utilizando React 19, Server Actions, TypeScript e Tailwind CSS do zero ao deploy.',
    longDescription: 'Neste curso definitivo, você aprenderá as arquiteturas mais modernas do mercado de desenvolvimento web. Vamos explorar desde o roteamento dinâmico (App Router) até o uso avançado de Server Actions, otimização de imagens, internacionalização, middlewares e integração completa com bancos de dados relacionais e ORMs modernos como Prisma.',
    rating: 4.9,
    studentsCount: 1420,
    modulesCount: 5,
    duration: '42 horas',
    level: 'Avançado',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
    instructorName: 'Prof. Guilherme Antunes',
    instructorRole: 'Principal Software Architect',
    instructorBio: 'Mais de 12 anos de experiência desenvolvendo sistemas distribuídos de alta escala nos EUA e América Latina. Especialista em React e Ecossistema JavaScript.',
    modules: [
      {
        id: 'fs-m1',
        title: 'Módulo 1: Fundamentos do Next.js App Router',
        lessons: [
          { id: 'fs-l1', title: 'Introdução ao ecossistema Next.js 15', duration: '15:20' },
          { id: 'fs-l2', title: 'Server Components vs Client Components', duration: '28:45' },
          { id: 'fs-l3', title: 'Layouts aninhados e Páginas Dinâmicas', duration: '32:10' }
        ]
      },
      {
        id: 'fs-m2',
        title: 'Módulo 2: Gerenciamento de Estado & Server Actions',
        lessons: [
          { id: 'fs-l4', title: 'Mutando dados com Server Actions com segurança', duration: '25:15' },
          { id: 'fs-l5', title: 'Validação schema-based com Zod', duration: '22:40' },
          { id: 'fs-l6', title: 'Optimistic Updates para UX fluida', duration: '18:30' }
        ]
      },
      {
        id: 'fs-m3',
        title: 'Módulo 3: Integração de Banco de Dados & Prisma',
        lessons: [
          { id: 'fs-l7', title: 'Modelando o banco de dados com PostgreSQL', duration: '30:00' },
          { id: 'fs-l8', title: 'Relacionamentos de tabelas e Migrations', duration: '27:50' },
          { id: 'fs-l9', title: 'Queries performáticas e Caching avançado', duration: '35:10' }
        ]
      },
      {
        id: 'fs-m4',
        title: 'Módulo 4: Autenticação Segura & Middlewares',
        lessons: [
          { id: 'fs-l10', title: 'Autenticação multifator via NextAuth.js / Auth.js', duration: '40:15' },
          { id: 'fs-l11', title: 'Protegendo rotas sensíveis com Middlewares', duration: '19:40' }
        ]
      },
      {
        id: 'fs-m5',
        title: 'Módulo 5: Testes & Deploy de Alta Performance',
        lessons: [
          { id: 'fs-l12', title: 'Testando Server Components com Vitest', duration: '24:10' },
          { id: 'fs-l13', title: 'CI/CD e Deploy na Vercel com Otimizações', duration: '20:55' }
        ]
      }
    ]
  },
  {
    id: 'design-systems-uiux',
    title: 'UI/UX Design Systems Avançado no Figma',
    category: 'design',
    description: 'Aprenda a planejar, estruturar e gerenciar sistemas de design escaláveis, construindo componentes acessíveis e consistentes no Figma.',
    longDescription: 'Um Design System robusto é o pilar que conecta design e engenharia em produtos digitais bem-sucedidos. Neste treinamento prático de nível sênior, você aprenderá a estruturar tokens de design, componentização avançada com variantes completas, propriedades lógicas, auto layout 5.0 e documentações profissionais de componentes para transferência de design.',
    rating: 4.8,
    studentsCount: 840,
    modulesCount: 4,
    duration: '28 horas',
    level: 'Intermediário',
    image: 'https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=600&auto=format&fit=crop',
    instructorName: 'Mariana Medeiros',
    instructorRole: 'Head of Product Design',
    instructorBio: 'Visual designer apaixonada por design systems. Atua liderando times globais e definindo guias visuais interativos para multinacionais do setor financeiro.',
    modules: [
      {
        id: 'ds-m1',
        title: 'Módulo 1: Anatomia de um Design System & Tokens',
        lessons: [
          { id: 'ds-l1', title: 'O que é um Design System na prática empresarial?', duration: '18:40' },
          { id: 'ds-l2', title: 'Figma Variables: Definindo tokens de cor e espaçamento', duration: '32:15' },
          { id: 'ds-l3', title: 'Sistemas de Tipografia e Grades responsivas', duration: '25:10' }
        ]
      },
      {
        id: 'ds-m2',
        title: 'Módulo 2: Componentes Atômicos Avançados',
        lessons: [
          { id: 'ds-l4', title: 'Botões robustos com múltiplos estados e variantes', duration: '29:50' },
          { id: 'ds-l5', title: 'Inputs e feedbacks dinâmicos estruturados', duration: '27:40' }
        ]
      },
      {
        id: 'ds-m3',
        title: 'Módulo 3: Organismos & Templates Interativos',
        lessons: [
          { id: 'ds-l6', title: 'Modais, Sidebars e tabelas complexas com Auto Layout', duration: '35:30' },
          { id: 'ds-l7', title: 'Construindo protótipos de alta fidelidade baseados em tokens', duration: '22:15' }
        ]
      },
      {
        id: 'ds-m4',
        title: 'Módulo 4: Governança & Handoff para Devs',
        lessons: [
          { id: 'ds-l8', title: 'Documentando componentes e guias de uso no Figma', duration: '24:10' },
          { id: 'ds-l9', title: 'Handoff perfeito usando CSS variables e tokens JSON', duration: '31:50' }
        ]
      }
    ]
  },
  {
    id: 'datascience-ai',
    title: 'Data Science & Engenharia de IA de Produção',
    category: 'data',
    description: 'Domine pipelines de Machine Learning, engenharia de prompts e LLMs modernas integradas no ciclo de engenharia de dados.',
    longDescription: 'A inteligência artificial transformou a análise de dados. Este curso foca na criação de valor prático. Iremos além dos notebooks de laboratório para criar pipelines automatizados de preparação de dados com Pandas, treinamento de modelos clássicos via Scikit-Learn e o ciclo completo de implantação de Large Language Models (LLMs) usando LangChain e bancos de dados vetoriais.',
    rating: 4.7,
    studentsCount: 650,
    modulesCount: 4,
    duration: '35 horas',
    level: 'Avançado',
    image: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?q=80&w=600&auto=format&fit=crop',
    instructorName: 'Dr. Roberto Vasconcellos',
    instructorRole: 'AI Research Director',
    instructorBio: 'Doutor em Computação Científica com publicações internacionais em modelos generativos. Consultor sênior de grandes laboratórios de tecnologia na Europa.',
    modules: [
      {
        id: 'dt-m1',
        title: 'Módulo 1: Pré-processamento & Análise Exploratória',
        lessons: [
          { id: 'dt-l1', title: 'Pipelines eficientes de limpeza de dados com Pandas', duration: '28:10' },
          { id: 'dt-l2', title: 'Engenharia de features para modelos preditivos', duration: '35:40' }
        ]
      },
      {
        id: 'dt-m2',
        title: 'Módulo 2: Machine Learning e Avaliação de Modelos',
        lessons: [
          { id: 'dt-l3', title: 'Algoritmos Supervisionados avançados', duration: '31:20' },
          { id: 'dt-l4', title: 'Métricas de avaliação e validação cruzada k-fold', duration: '26:50' }
        ]
      },
      {
        id: 'dt-m3',
        title: 'Módulo 3: Large Language Models (LLMs) & LangChain',
        lessons: [
          { id: 'dt-l5', title: 'Entendendo Embeddings e Bancos de Dados Vetoriais', duration: '29:45' },
          { id: 'dt-l6', title: 'Arquitetura RAG (Retrieval-Augmented Generation) com LangChain', duration: '38:15' }
        ]
      },
      {
        id: 'dt-m4',
        title: 'Módulo 4: Implantação e Monitoramento',
        lessons: [
          { id: 'dt-l7', title: 'Empacotando modelos e APIs com FastAPI e Docker', duration: '34:00' },
          { id: 'dt-l8', title: 'Monitoramento contra data-drift em produção', duration: '23:55' }
        ]
      }
    ]
  },
  {
    id: 'react-native-expo',
    title: 'React Native & TypeScript: Apps Nativo de Alta Performance',
    category: 'programming',
    description: 'Construa aplicativos móveis nativos e híbridos fluidos para iOS e Android usando Expo Router, TypeScript e reanimated.',
    longDescription: 'Aprenda a construir experiências nativas de excelência. Exploraremos os novos recursos da arquitetura do React Native, manipulação eficiente de gestos, animações nativas super fluidas a 60fps usando Reanimated 3, e o moderno Expo Router para gerenciamento de navegação baseado em arquivos.',
    rating: 4.9,
    studentsCount: 1100,
    modulesCount: 4,
    duration: '38 horas',
    level: 'Intermediário',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop',
    instructorName: 'Prof. Guilherme Antunes',
    instructorRole: 'Principal Software Architect',
    instructorBio: 'Mais de 12 anos de experiência desenvolvendo sistemas distribuídos de alta escala nos EUA e América Latina. Especialista em React e Ecossistema JavaScript.',
    modules: [
      {
        id: 'rn-m1',
        title: 'Módulo 1: Setup do Expo & File-based Routing',
        lessons: [
          { id: 'rn-l1', title: 'Instalando Expo CLI e configurando simuladores', duration: '22:15' },
          { id: 'rn-l2', title: 'Navegação baseada em arquivos com Expo Router', duration: '28:30' }
        ]
      },
      {
        id: 'rn-m2',
        title: 'Módulo 2: Estilização Fluida & Temas',
        lessons: [
          { id: 'rn-l3', title: 'Criando layouts dinâmicos com Flexbox e StyleSheet', duration: '20:10' },
          { id: 'rn-l4', title: 'Gerenciando Temas Escuro e Claro nativos', duration: '24:50' }
        ]
      },
      {
        id: 'rn-m3',
        title: 'Módulo 3: Animações e Performance',
        lessons: [
          { id: 'rn-l5', title: 'Princípios do Reanimated e o Thread de UI', duration: '33:15' },
          { id: 'rn-l6', title: 'Interações físicas de arrastar e pinçar com Gesture Handler', duration: '31:40' }
        ]
      },
      {
        id: 'rn-m4',
        title: 'Módulo 4: Recursos Nativos & Lançamento',
        lessons: [
          { id: 'rn-l7', title: 'Acessando Câmera, Localização e Armazenamento Local', duration: '29:20' },
          { id: 'rn-l8', title: 'Compilando e gerando builds de produção na EAS (Expo)', duration: '27:10' }
        ]
      }
    ]
  }
];
