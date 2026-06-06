const fetch = require('node-fetch');

async function test() {
  try {
    const [cursosRes, modulosRes, aulasRes, trilhasRes, trilhasCursosRes, catRes] = await Promise.all([
      fetch('http://localhost:3000/cursos'),
      fetch('http://localhost:3000/modulos'),
      fetch('http://localhost:3000/aulas'),
      fetch('http://localhost:3000/trilhas'),
      fetch('http://localhost:3000/trilhas_cursos'),
      fetch('http://localhost:3000/categorias')
    ]);
      
    if (!cursosRes.ok) {
      throw new Error('Certifique-se de que o json-server está rodando na porta 3000');
    }

    const dbCursos = await cursosRes.json();
    const dbModulos = await modulosRes.json();
    const dbAulas = await aulasRes.json();
    const dbTrilhas = await trilhasRes.json();
    const dbTrilhasCursos = await trilhasCursosRes.json();
    const dbCategorias = await catRes.json();

    console.log("Fetched successfully");

    const mappedCourses = dbCursos.map(c => {
      const courseModules = dbModulos.filter(m => m.ID_Curso === c.id).sort((a, b) => a.Ordem - b.Ordem);
      const mappedModules = courseModules.map(m => {
        const moduleLessons = dbAulas.filter(a => a.ID_Modulo === m.id).sort((a, b) => a.Ordem - b.Ordem);
        return {
          id: m.id,
          title: m.Titulo,
          lessons: moduleLessons.map(l => ({
            id: l.id,
            title: l.Titulo,
            duration: l.DuracaoMinutos.toString() + ' min',
            videoUrl: l.URL_Conteudo
          }))
        };
      });

      return {
        id: c.id,
        title: c.Titulo,
        category: c.ID_Categoria,
        description: c.Descricao,
        longDescription: c.Descricao,
        rating: 5,
        studentsCount: 0,
        modulesCount: mappedModules.length,
        duration: c.TotalHoras + ' horas',
        level: c.Nivel,
        image: c.Imagem || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop',
        instructorName: 'Professor(a)',
        instructorRole: 'Instrutor(a)',
        instructorBio: '',
        modules: mappedModules
      };
    });

    console.log("Mapped courses length:", mappedCourses.length);
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
