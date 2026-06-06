import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Course, LearningPath, Module, DBCurso, DBModulo, DBAula, DBTrilha, DBTrilhaCurso } from '../types';

interface DataContextType {
  courses: Course[];
  paths: LearningPath[];
  categories: { id: string, name: string }[];
  addCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
  addPath: (path: LearningPath) => void;
  updatePath: (path: LearningPath) => void;
  deletePath: (id: string) => void;
  addCategory: (category: { id: string, name: string }) => void;
  updateCategory: (category: { id: string, name: string }) => void;
  deleteCategory: (id: string) => void;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);

  const loadData = async () => {
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

      const dbCursos: DBCurso[] = await cursosRes.json();
      const dbModulos: DBModulo[] = await modulosRes.json();
      const dbAulas: DBAula[] = await aulasRes.json();
      const dbTrilhas: DBTrilha[] = await trilhasRes.json();
      const dbTrilhasCursos: DBTrilhaCurso[] = await trilhasCursosRes.json();
      const dbCategorias = await catRes.json();

      setCategories(dbCategorias.map((c: any) => ({ id: c.id, name: c.Nome })));

      // Mapear dados relacionais para o formato aninhado que a UI espera
      const mappedCourses: Course[] = dbCursos.map(c => {
        const courseModules = dbModulos.filter(m => m.ID_Curso === c.id).sort((a, b) => a.Ordem - b.Ordem);
        const mappedModules: Module[] = courseModules.map(m => {
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

      setCourses(mappedCourses);

      const mappedPaths: LearningPath[] = dbTrilhas.map(t => {
        const pathCourses = dbTrilhasCursos.filter(tc => tc.ID_Trilha === t.id).sort((a, b) => a.Ordem - b.Ordem);
        return {
          id: t.id,
          title: t.Titulo,
          description: t.Descricao,
          icon: '🚀',
          coursesIds: pathCourses.map(tc => tc.ID_Curso)
        };
      });

      setPaths(mappedPaths);
    } catch (error) {
      console.error("Erro ao buscar dados do json-server:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Funções de CRUD (POST/PUT/DELETE API e atualização de estado)
  const addCourse = async (course: Course) => {
    try {
      await fetch('http://localhost:3000/cursos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: course.id,
          Titulo: course.title,
          Descricao: course.description,
          ID_Instrutor: 'admin-1',
          ID_Categoria: course.category,
          Nivel: course.level,
          DataPublicacao: new Date().toISOString(),
          TotalAulas: 0,
          TotalHoras: '10',
          Imagem: course.image
        })
      });
      setCourses([...courses, course]);
    } catch (e) {
      console.error(e);
      setCourses([...courses, course]); // Fallback UI
    }
  };

  const updateCourse = async (updated: Course) => {
    try {
      await fetch(`http://localhost:3000/cursos/${updated.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Titulo: updated.title,
          Descricao: updated.description
        })
      });
      setCourses(courses.map(c => c.id === updated.id ? updated : c));
    } catch (e) {
      setCourses(courses.map(c => c.id === updated.id ? updated : c));
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/cursos/${id}`, { method: 'DELETE' });
      setCourses(courses.filter(c => c.id !== id));
    } catch (e) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const addPath = async (path: LearningPath) => {
    try {
      await fetch('http://localhost:3000/trilhas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: path.id,
          Titulo: path.title,
          Descricao: path.description,
          ID_Categoria: 'cat-programming'
        })
      });
      setPaths([...paths, path]);
    } catch (e) {
      setPaths([...paths, path]);
    }
  };

  const updatePath = async (updated: LearningPath) => {
    try {
      await fetch(`http://localhost:3000/trilhas/${updated.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Titulo: updated.title,
          Descricao: updated.description
        })
      });
      setPaths(paths.map(p => p.id === updated.id ? updated : p));
    } catch (e) {
      setPaths(paths.map(p => p.id === updated.id ? updated : p));
    }
  };

  const deletePath = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/trilhas/${id}`, { method: 'DELETE' });
    } catch(e) { console.error(e); }
    setPaths(prev => prev.filter(p => p.id !== id));
  };

  const addCategory = async (category: { id: string, name: string }) => {
    try {
      await fetch('http://localhost:3000/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: category.id, Nome: category.name })
      });
    } catch (e) { console.error(e); }
    setCategories(prev => [...prev, category]);
  };

  const updateCategory = async (category: { id: string, name: string }) => {
    try {
      await fetch(`http://localhost:3000/categorias/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: category.id, Nome: category.name })
      });
    } catch(e) { console.error(e); }
    setCategories(prev => prev.map(c => c.id === category.id ? category : c));
  };

  const deleteCategory = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/categorias/${id}`, { method: 'DELETE' });
    } catch(e) { console.error(e); }
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return (
    <DataContext.Provider value={{ 
      courses, paths, categories, 
      addCourse, updateCourse, deleteCourse, 
      addPath, updatePath, deletePath,
      addCategory, updateCategory, deleteCategory,
      refreshData: loadData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
