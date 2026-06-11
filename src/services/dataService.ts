import { Course, LearningPath, DBCurso, DBModulo, DBAula, DBTrilha, DBTrilhaCurso } from '../types';

const API_URL = 'http://localhost:3000';

export async function fetchAllData() {
  const [cursosRes, modulosRes, aulasRes, trilhasRes, trilhasCursosRes, catRes] = await Promise.all([
    fetch(`${API_URL}/cursos`),
    fetch(`${API_URL}/modulos`),
    fetch(`${API_URL}/aulas`),
    fetch(`${API_URL}/trilhas`),
    fetch(`${API_URL}/trilhas_cursos`),
    fetch(`${API_URL}/categorias`)
  ]);

  if (!cursosRes.ok) throw new Error('Falha ao conectar no json-server');

  const dbCursos: DBCurso[] = await cursosRes.json();
  const dbModulos: DBModulo[] = await modulosRes.json();
  const dbAulas: DBAula[] = await aulasRes.json();
  const dbTrilhas: DBTrilha[] = await trilhasRes.json();
  const dbTrilhasCursos: DBTrilhaCurso[] = await trilhasCursosRes.json();
  const dbCategorias = await catRes.json();

  const categories = dbCategorias.map((c: any) => ({ id: c.id, name: c.Nome }));

  const courses: Course[] = dbCursos.map(c => {
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

  const paths: LearningPath[] = dbTrilhas.map(t => {
    const pathCourses = dbTrilhasCursos.filter(tc => tc.ID_Trilha === t.id).sort((a, b) => a.Ordem - b.Ordem);
    return {
      id: t.id,
      title: t.Titulo,
      description: t.Descricao,
      icon: '🚀',
      coursesIds: pathCourses.map(tc => tc.ID_Curso)
    };
  });

  return { courses, paths, categories };
}

export async function addCourse(course: Course) {
  await fetch(`${API_URL}/cursos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: course.id,
      Titulo: course.title,
      Descricao: course.description,
      ID_Instrutor: 'inst-1',
      ID_Categoria: course.category || 'cat-programming',
      Nivel: course.level || 'Iniciante',
      DataPublicacao: new Date().toISOString(),
      TotalAulas: 0,
      TotalHoras: parseInt(course.duration) || 0,
      Imagem: course.image
    })
  });
  window.dispatchEvent(new Event('data_change'));
}

export async function updateCourse(course: Course) {
  await fetch(`${API_URL}/cursos/${course.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      Titulo: course.title,
      Descricao: course.description,
      ID_Categoria: course.category,
      Nivel: course.level,
      TotalHoras: parseInt(course.duration) || 0,
      Imagem: course.image
    })
  });
  window.dispatchEvent(new Event('data_change'));
}

export async function deleteCourse(id: string) {
  await fetch(`${API_URL}/cursos/${id}`, { method: 'DELETE' });
  window.dispatchEvent(new Event('data_change'));
}

export async function addPath(path: LearningPath) {
  await fetch(`${API_URL}/trilhas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: path.id,
      Titulo: path.title,
      Descricao: path.description,
      ID_Categoria: 'cat-programming'
    })
  });
  
  for (let i = 0; i < path.coursesIds.length; i++) {
    await fetch(`${API_URL}/trilhas_cursos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: `tc-${Date.now()}-${i}`,
        ID_Trilha: path.id,
        ID_Curso: path.coursesIds[i],
        Ordem: i + 1
      })
    });
  }
  window.dispatchEvent(new Event('data_change'));
}

export async function updatePath(path: LearningPath) {
  await fetch(`${API_URL}/trilhas/${path.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      Titulo: path.title,
      Descricao: path.description
    })
  });
  window.dispatchEvent(new Event('data_change'));
}

export async function deletePath(id: string) {
  await fetch(`${API_URL}/trilhas/${id}`, { method: 'DELETE' });
  window.dispatchEvent(new Event('data_change'));
}

export async function addCategory(category: { id: string, name: string }) {
  await fetch(`${API_URL}/categorias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: category.id,
      Nome: category.name,
      Descricao: 'Nova categoria adicionada'
    })
  });
  window.dispatchEvent(new Event('data_change'));
}

export async function updateCategory(category: { id: string, name: string }) {
  await fetch(`${API_URL}/categorias/${category.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      Nome: category.name
    })
  });
  window.dispatchEvent(new Event('data_change'));
}

export async function deleteCategory(id: string) {
  await fetch(`${API_URL}/categorias/${id}`, { method: 'DELETE' });
  window.dispatchEvent(new Event('data_change'));
}
