import { LearningPath } from '../types';

export const PATHS_DATA: LearningPath[] = [
  {
    id: 'path-frontend-master',
    title: 'Trilha Frontend Master',
    description: 'Do zero ao especialista em interfaces. Comece dominando o Design de Sistemas e avance para o desenvolvimento de alta performance com Next.js.',
    icon: '💻',
    coursesIds: ['design-systems-uiux', 'fullstack-nextjs']
  },
  {
    id: 'path-mobile-specialist',
    title: 'Especialista Mobile',
    description: 'Crie aplicativos móveis de alto nível. Inicie construindo sistemas de design e aplique-os no desenvolvimento React Native nativo.',
    icon: '📱',
    coursesIds: ['design-systems-uiux', 'react-native-expo']
  },
  {
    id: 'path-ai-engineer',
    title: 'Engenheiro de Inteligência Artificial',
    description: 'A fundação completa para trabalhar com IA, abordando desde arquitetura de software com Next.js até pipelines complexos de Data Science.',
    icon: '🤖',
    coursesIds: ['fullstack-nextjs', 'datascience-ai']
  }
];
