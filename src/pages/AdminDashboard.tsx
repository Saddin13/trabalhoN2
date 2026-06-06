import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Course, LearningPath } from '../types';
import { Settings, Users, BookOpen, Map } from 'lucide-react';

export default function AdminDashboard() {
  const { courses, paths, addCourse, updateCourse, deleteCourse, addPath, updatePath, deletePath } = useData();
  const { getAllUsers } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'courses' | 'paths' | 'users'>('courses');

  // Simple state for creating a new course (just the basic structure to show it works)
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseId, setNewCourseId] = useState('');

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle || !newCourseId) return;

    const newCourse: Course = {
      id: newCourseId,
      title: newCourseTitle,
      description: 'Descrição padrão (Adicionado via Admin)',
      longDescription: 'Descrição longa do curso novo.',
      instructorName: 'Professor X',
      instructorBio: 'Especialista',
      instructorRole: 'Instrutor',
      level: 'Iniciante',
      duration: '10h',
      studentsCount: 0,
      rating: 5.0,
      modulesCount: 1,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
      category: 'programming',
      modules: [
        {
          id: `mod-${Date.now()}`,
          title: 'Módulo 1',
          lessons: [
            {
              id: `less-${Date.now()}`,
              title: 'Aula de Introdução',
              duration: '10 min',
              videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
            }
          ]
        }
      ]
    };
    addCourse(newCourse);
    setNewCourseTitle('');
    setNewCourseId('');
    alert('Curso adicionado com sucesso!');
  };

  const [newPathId, setNewPathId] = useState('');
  const [newPathTitle, setNewPathTitle] = useState('');
  const [newPathDesc, setNewPathDesc] = useState('');

  const handleAddPath = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPathId || !newPathTitle) return;

    const newPath: LearningPath = {
      id: newPathId,
      title: newPathTitle,
      description: newPathDesc || 'Trilha adicionada via Admin',
      icon: '🚀',
      coursesIds: []
    };
    addPath(newPath);
    setNewPathId('');
    setNewPathTitle('');
    setNewPathDesc('');
    alert('Trilha adicionada com sucesso! Você pode editar o arquivo json se precisar associar cursos a ela posteriormente.');
  };

  const users = getAllUsers();

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="bg-warning bg-opacity-25 p-3 rounded-3 text-warning">
          <Settings size={32} />
        </div>
        <div>
          <h2 className="display-font fw-bold text-white mb-0">Painel do Administrador</h2>
          <p className="text-secondary mb-0">Gerencie todo o conteúdo da plataforma.</p>
        </div>
      </div>

      <ul className="nav nav-pills mb-4 gap-2">
        <li className="nav-item">
          <button 
            className={`btn ${activeTab === 'courses' ? 'btn-premium-primary' : 'btn-outline-secondary text-white'}`}
            onClick={() => setActiveTab('courses')}
          >
            <BookOpen size={16} className="me-2" />
            Cursos
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`btn ${activeTab === 'paths' ? 'btn-premium-primary' : 'btn-outline-secondary text-white'}`}
            onClick={() => setActiveTab('paths')}
          >
            <Map size={16} className="me-2" />
            Trilhas
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`btn ${activeTab === 'users' ? 'btn-premium-primary' : 'btn-outline-secondary text-white'}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={16} className="me-2" />
            Usuários
          </button>
        </li>
      </ul>

      {/* Cursos Tab */}
      {activeTab === 'courses' && (
        <div className="row g-4">
          <div className="col-md-4">
            <div className="glass-panel p-4 rounded-4 h-100">
              <h5 className="text-white fw-bold mb-4">Adicionar Novo Curso</h5>
              <form onSubmit={handleAddCourse}>
                <div className="mb-3">
                  <label className="form-label text-secondary small">ID do Curso (único, ex: curso-xyz)</label>
                  <input type="text" className="form-control glass-input text-white" value={newCourseId} onChange={e => setNewCourseId(e.target.value)} required />
                </div>
                <div className="mb-4">
                  <label className="form-label text-secondary small">Título do Curso</label>
                  <input type="text" className="form-control glass-input text-white" value={newCourseTitle} onChange={e => setNewCourseTitle(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-premium-primary w-100">Criar Curso</button>
              </form>
            </div>
          </div>
          <div className="col-md-8">
            <div className="glass-panel p-4 rounded-4 h-100">
              <h5 className="text-white fw-bold mb-4">Cursos Existentes ({courses.length})</h5>
              <div className="table-responsive">
                <table className="table table-dark table-hover bg-transparent">
                  <thead>
                    <tr>
                      <th className="bg-transparent text-secondary border-secondary border-opacity-25">ID</th>
                      <th className="bg-transparent text-secondary border-secondary border-opacity-25">Título</th>
                      <th className="bg-transparent text-secondary border-secondary border-opacity-25">Módulos</th>
                      <th className="bg-transparent text-secondary border-secondary border-opacity-25">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map(c => (
                      <tr key={c.id}>
                        <td className="bg-transparent border-secondary border-opacity-25">{c.id}</td>
                        <td className="bg-transparent border-secondary border-opacity-25 fw-bold">{c.title}</td>
                        <td className="bg-transparent border-secondary border-opacity-25">{c.modulesCount}</td>
                        <td className="bg-transparent border-secondary border-opacity-25">
                          <button className="btn btn-sm btn-outline-danger" onClick={() => deleteCourse(c.id)}>Excluir</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trilhas Tab */}
      {activeTab === 'paths' && (
        <div className="row g-4">
          <div className="col-md-4">
            <div className="glass-panel p-4 rounded-4 h-100">
              <h5 className="text-white fw-bold mb-4">Adicionar Nova Trilha</h5>
              <form onSubmit={handleAddPath}>
                <div className="mb-3">
                  <label className="form-label text-secondary small">ID da Trilha (ex: path-novo)</label>
                  <input type="text" className="form-control glass-input text-white" value={newPathId} onChange={e => setNewPathId(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label text-secondary small">Título da Trilha</label>
                  <input type="text" className="form-control glass-input text-white" value={newPathTitle} onChange={e => setNewPathTitle(e.target.value)} required />
                </div>
                <div className="mb-4">
                  <label className="form-label text-secondary small">Descrição (Opcional)</label>
                  <textarea className="form-control glass-input text-white" value={newPathDesc} onChange={e => setNewPathDesc(e.target.value)} rows={3}></textarea>
                </div>
                <button type="submit" className="btn btn-premium-primary w-100">Criar Trilha</button>
              </form>
            </div>
          </div>
          <div className="col-md-8">
            <div className="glass-panel p-4 rounded-4 h-100">
              <h5 className="text-white fw-bold mb-4">Trilhas Existentes ({paths.length})</h5>
              <div className="table-responsive">
                <table className="table table-dark table-hover bg-transparent">
                  <thead>
                    <tr>
                      <th className="bg-transparent text-secondary border-secondary border-opacity-25">ID</th>
                      <th className="bg-transparent text-secondary border-secondary border-opacity-25">Título</th>
                      <th className="bg-transparent text-secondary border-secondary border-opacity-25">Cursos Vinculados</th>
                      <th className="bg-transparent text-secondary border-secondary border-opacity-25">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paths.map(p => (
                      <tr key={p.id}>
                        <td className="bg-transparent border-secondary border-opacity-25">{p.id}</td>
                        <td className="bg-transparent border-secondary border-opacity-25 fw-bold">{p.icon} {p.title}</td>
                        <td className="bg-transparent border-secondary border-opacity-25">{p.coursesIds.length} cursos</td>
                        <td className="bg-transparent border-secondary border-opacity-25">
                          <button className="btn btn-sm btn-outline-danger" onClick={() => deletePath(p.id)}>Excluir</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="glass-panel p-4 rounded-4">
          <h5 className="text-white fw-bold mb-4">Usuários ({users.length})</h5>
          <div className="table-responsive">
            <table className="table table-dark table-hover bg-transparent">
              <thead>
                <tr>
                  <th className="bg-transparent text-secondary border-secondary border-opacity-25">Nome</th>
                  <th className="bg-transparent text-secondary border-secondary border-opacity-25">Email</th>
                  <th className="bg-transparent text-secondary border-secondary border-opacity-25">Tipo</th>
                  <th className="bg-transparent text-secondary border-secondary border-opacity-25">Cursos (Qtd)</th>
                  <th className="bg-transparent text-secondary border-secondary border-opacity-25">Certificados (Qtd)</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="bg-transparent border-secondary border-opacity-25 fw-bold">{u.name}</td>
                    <td className="bg-transparent border-secondary border-opacity-25">{u.email}</td>
                    <td className="bg-transparent border-secondary border-opacity-25">
                      <span className={`badge ${u.role === 'admin' ? 'bg-warning text-dark' : 'bg-primary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="bg-transparent border-secondary border-opacity-25">{u.enrolledCourses.length}</td>
                    <td className="bg-transparent border-secondary border-opacity-25">{u.certificates.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
