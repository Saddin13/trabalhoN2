const fs = require('fs');

const coursesData = [
  {
    id: 'fullstack-nextjs',
    title: 'Fullstack Next.js 15 & React 19 Mastery',
    category: 'cat-programming',
    description: 'Domine a criação de aplicações web ultra-rápidas utilizando React 19, Server Actions, TypeScript e Tailwind CSS do zero ao deploy.',
    duration: '42',
    level: 'Avançado',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
    modules: [
      {
        id: 'fs-m1',
        title: 'Módulo 1: Fundamentos do Next.js App Router',
        lessons: [
          { id: 'fs-l1', title: 'Introdução ao ecossistema Next.js 15', duration: '15', videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk' },
          { id: 'fs-l2', title: 'Server Components vs Client Components', duration: '28', videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk' }
        ]
      }
    ]
  },
  {
    id: 'design-systems-uiux',
    title: 'UI/UX Design Systems Avançado no Figma',
    category: 'cat-design',
    description: 'Aprenda a planejar, estruturar e gerenciar sistemas de design escaláveis...',
    duration: '28',
    level: 'Intermediário',
    image: 'https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=600&auto=format&fit=crop',
    modules: [
      {
        id: 'ds-m1',
        title: 'Módulo 1: Anatomia de um Design System & Tokens',
        lessons: [
          { id: 'ds-l1', title: 'O que é um Design System na prática empresarial?', duration: '18', videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk' }
        ]
      }
    ]
  }
];

const pathsData = [
  {
    id: 'path-frontend-master',
    title: 'Trilha Frontend Master',
    description: 'Do zero ao especialista em interfaces.',
    categoryId: 'cat-programming',
    coursesIds: ['design-systems-uiux', 'fullstack-nextjs']
  }
];

const db = {
  usuarios: [],
  categorias: [
    { id: "cat-programming", Nome: "Programação", Descricao: "Cursos de programação" },
    { id: "cat-design", Nome: "Design", Descricao: "Cursos de design" },
    { id: "cat-data", Nome: "Dados", Descricao: "Cursos de dados" }
  ],
  cursos: [],
  modulos: [],
  aulas: [],
  matriculas: [],
  progresso_aulas: [],
  avaliacoes: [],
  trilhas: [],
  trilhas_cursos: [],
  certificados: [],
  planos: [
    { id: "plano-1", Nome: "Mensal", Descricao: "Acesso por 1 mês", Preco: 29.90, DuracaoMeses: 1 },
    { id: "plano-2", Nome: "Anual", Descricao: "Acesso por 12 meses", Preco: 299.90, DuracaoMeses: 12 }
  ],
  assinaturas: [],
  pagamentos: []
};

coursesData.forEach(c => {
  db.cursos.push({
    id: c.id,
    Titulo: c.title,
    Descricao: c.description,
    ID_Instrutor: "admin-1",
    ID_Categoria: c.category,
    Nivel: c.level,
    DataPublicacao: new Date().toISOString(),
    TotalAulas: c.modules.reduce((acc, m) => acc + m.lessons.length, 0),
    TotalHoras: c.duration,
    Imagem: c.image
  });

  c.modules.forEach((m, mIdx) => {
    db.modulos.push({
      id: m.id,
      ID_Curso: c.id,
      Titulo: m.title,
      Ordem: mIdx + 1
    });

    m.lessons.forEach((l, lIdx) => {
      db.aulas.push({
        id: l.id,
        ID_Modulo: m.id,
        Titulo: l.title,
        TipoConteudo: "Vídeo",
        URL_Conteudo: l.videoUrl,
        DuracaoMinutos: parseInt(l.duration),
        Ordem: lIdx + 1
      });
    });
  });
});

pathsData.forEach(p => {
  db.trilhas.push({
    id: p.id,
    Titulo: p.title,
    Descricao: p.description,
    ID_Categoria: p.categoryId
  });

  p.coursesIds.forEach((cId, idx) => {
    db.trilhas_cursos.push({
      id: `${p.id}-${cId}`,
      ID_Trilha: p.id,
      ID_Curso: cId,
      Ordem: idx + 1
    });
  });
});

fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
