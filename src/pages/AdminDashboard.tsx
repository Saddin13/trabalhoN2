import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Course, LearningPath } from '../types';
import { Settings, Users, BookOpen, Map } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export default function AdminDashboard() {
  const { 
    courses, paths, categories, 
    addCourse, updateCourse, deleteCourse, 
    addPath, updatePath, deletePath,
    addCategory, updateCategory, deleteCategory,
    refreshData
  } = useData();
  const { getAllUsers } = useAuth();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'courses' | 'paths' | 'users' | 'categories'>('courses');

  // Estados para gerenciar Módulos de um Curso
  const [managingCourseId, setManagingCourseId] = useState<string | null>(null);
  const managingCourse = courses.find(c => c.id === managingCourseId);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  
  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingCourseId || !newModuleTitle) return;
    try {
      await fetch('http://localhost:3000/modulos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `mod-${Date.now()}`,
          ID_Curso: managingCourseId,
          Titulo: newModuleTitle,
          Ordem: managingCourse?.modules.length ? managingCourse.modules.length + 1 : 1
        })
      });
      setNewModuleTitle('');
      await refreshData();
      showToast('Módulo adicionado!', 'success');
    } catch(e) { console.error(e); }
  };

  const handleDeleteModule = async (modId: string) => {
    try {
      await fetch(`http://localhost:3000/modulos/${modId}`, { method: 'DELETE' });
      await refreshData();
      showToast('Módulo removido!', 'success');
    } catch(e) { console.error(e); }
  };

  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonUrl, setNewLessonUrl] = useState('');
  const [addingLessonToModId, setAddingLessonToModId] = useState<string | null>(null);

  const handleAddLesson = async (e: React.FormEvent, modId: string) => {
    e.preventDefault();
    if (!newLessonTitle || !newLessonUrl) return;
    try {
      await fetch('http://localhost:3000/aulas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `less-${Date.now()}`,
          ID_Modulo: modId,
          Titulo: newLessonTitle,
          TipoConteudo: 'Vídeo',
          URL_Conteudo: newLessonUrl,
          DuracaoMinutos: 10,
          Ordem: 1 // simplificado
        })
      });
      setNewLessonTitle('');
      setNewLessonUrl('');
      setAddingLessonToModId(null);
      await refreshData();
      showToast('Aula adicionada!', 'success');
    } catch(e) { console.error(e); }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      await fetch(`http://localhost:3000/aulas/${lessonId}`, { method: 'DELETE' });
      await refreshData();
      showToast('Aula removida!', 'success');
    } catch(e) { console.error(e); }
  };

  // Simple state for creating a new course
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
    showToast('Curso adicionado com sucesso!', 'success');
  };

  const [newPathId, setNewPathId] = useState('');
  const [newPathTitle, setNewPathTitle] = useState('');
  const [newPathDesc, setNewPathDesc] = useState('');

  // Estados de edição de curso
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editCourseTitle, setEditCourseTitle] = useState('');
  
  const startEditCourse = (c: Course) => {
    setEditingCourseId(c.id);
    setEditCourseTitle(c.title);
  };

  const handleUpdateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourseId) return;
    const course = courses.find(c => c.id === editingCourseId);
    if (course) {
      updateCourse({ ...course, title: editCourseTitle });
      showToast('Curso atualizado com sucesso!', 'success');
      setEditingCourseId(null);
    }
  };

  // Estados de edição de trilha
  const [editingPathId, setEditingPathId] = useState<string | null>(null);
  const [editPathTitle, setEditPathTitle] = useState('');

  const startEditPath = (p: LearningPath) => {
    setEditingPathId(p.id);
    setEditPathTitle(p.title);
  };

  const handleUpdatePath = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPathId) return;
    const path = paths.find(p => p.id === editingPathId);
    if (path) {
      updatePath({ ...path, title: editPathTitle });
      showToast('Trilha atualizada com sucesso!', 'success');
      setEditingPathId(null);
    }
  };

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
    showToast('Trilha adicionada com sucesso! Você pode editar o arquivo json se precisar associar cursos a ela posteriormente.', 'success');
  };

  // Estados de categoria
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  // Estados para vincular cursos a uma trilha
  const [linkingPathId, setLinkingPathId] = useState<string | null>(null);
  const [selectedCoursesForPath, setSelectedCoursesForPath] = useState<string[]>([]);

  const startLinkingPath = (p: LearningPath) => {
    setLinkingPathId(p.id);
    setSelectedCoursesForPath(p.coursesIds);
  };

  const handleToggleCourseForPath = (courseId: string) => {
    setSelectedCoursesForPath(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSavePathLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkingPathId) return;

    try {
      // Remover todos os vínculos atuais para esta trilha (simplificado apagando tudo e recriando)
      // Como o json-server não tem endpoint de bulk delete, o ideal seria buscar os atuais e deletar um por um
      const res = await fetch(`http://localhost:3000/trilhas_cursos?ID_Trilha=${linkingPathId}`);
      const atuais = await res.json();
      
      for (const link of atuais) {
        await fetch(`http://localhost:3000/trilhas_cursos/${link.id}`, { method: 'DELETE' });
      }

      // Adicionar os novos
      for (let i = 0; i < selectedCoursesForPath.length; i++) {
        const cId = selectedCoursesForPath[i];
        await fetch(`http://localhost:3000/trilhas_cursos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: `link-${Date.now()}-${i}`,
            ID_Trilha: linkingPathId,
            ID_Curso: cId,
            Ordem: i + 1
          })
        });
      }

      showToast('Cursos vinculados à trilha com sucesso! Atualize a página para ver os dados completos.', 'success');
      setLinkingPathId(null);
    } catch (e) {
      console.error(e);
      showToast('Erro ao salvar vínculos.', 'error');
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryId || !newCategoryName) return;
    addCategory({ id: newCategoryId, name: newCategoryName });
    setNewCategoryId('');
    setNewCategoryName('');
    showToast('Categoria adicionada!', 'success');
  };

  const startEditCategory = (c: { id: string, name: string }) => {
    setEditingCategoryId(c.id);
    setEditCategoryName(c.name);
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategoryId) return;
    updateCategory({ id: editingCategoryId, name: editCategoryName });
    showToast('Categoria atualizada!', 'success');
    setEditingCategoryId(null);
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
        <li className="nav-item">
          <button 
            className={`btn ${activeTab === 'categories' ? 'btn-premium-primary' : 'btn-outline-secondary text-white'}`}
            onClick={() => setActiveTab('categories')}
          >
            <BookOpen size={16} className="me-2" />
            Categorias
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
                          {editingCourseId === c.id ? (
                            <form onSubmit={handleUpdateCourse} className="d-flex gap-2">
                              <input type="text" className="form-control form-control-sm glass-input text-white" value={editCourseTitle} onChange={e => setEditCourseTitle(e.target.value)} required />
                              <button type="submit" className="btn btn-sm btn-success">Salvar</button>
                              <button type="button" className="btn btn-sm btn-secondary" onClick={() => setEditingCourseId(null)}>X</button>
                            </form>
                          ) : (
                            <div className="d-flex gap-2 flex-wrap">
                              <button className="btn btn-sm btn-outline-warning" onClick={() => setManagingCourseId(c.id)}>Módulos</button>
                              <button className="btn btn-sm btn-outline-info" onClick={() => startEditCourse(c)}>Editar</button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => deleteCourse(c.id)}>Excluir</button>
                            </div>
                          )}
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
                          {editingPathId === p.id ? (
                            <form onSubmit={handleUpdatePath} className="d-flex gap-2">
                              <input type="text" className="form-control form-control-sm glass-input text-white" value={editPathTitle} onChange={e => setEditPathTitle(e.target.value)} required />
                              <button type="submit" className="btn btn-sm btn-success">Salvar</button>
                              <button type="button" className="btn btn-sm btn-secondary" onClick={() => setEditingPathId(null)}>X</button>
                            </form>
                          ) : (
                            <div className="d-flex gap-2 flex-wrap">
                              <button className="btn btn-sm btn-outline-warning" onClick={() => startLinkingPath(p)}>Vincular Cursos</button>
                              <button className="btn btn-sm btn-outline-info" onClick={() => startEditPath(p)}>Editar</button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => deletePath(p.id)}>Excluir</button>
                            </div>
                          )}
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

      {/* Modal Vincular Cursos à Trilha */}
      {linkingPathId && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border-secondary border-opacity-25">
              <div className="modal-header border-secondary border-opacity-25">
                <h5 className="modal-title fw-bold">Vincular Cursos na Trilha</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setLinkingPathId(null)}></button>
              </div>
              <div className="modal-body">
                <p className="text-secondary small mb-3">Selecione os cursos que fazem parte desta trilha:</p>
                <form onSubmit={handleSavePathLinks}>
                  <div className="d-flex flex-column gap-2 mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {courses.map(c => (
                      <div key={c.id} className="form-check glass-panel p-2 rounded-3 d-flex align-items-center gap-2 m-0">
                        <input 
                          className="form-check-input ms-1 mt-0" 
                          type="checkbox" 
                          id={`link-${c.id}`} 
                          checked={selectedCoursesForPath.includes(c.id)}
                          onChange={() => handleToggleCourseForPath(c.id)}
                        />
                        <label className="form-check-label w-100 text-truncate" htmlFor={`link-${c.id}`} style={{ cursor: 'pointer' }}>
                          {c.title}
                        </label>
                      </div>
                    ))}
                  </div>
                  <button type="submit" className="btn btn-premium-primary w-100">Salvar Vínculos</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gerenciar Módulos */}
      {managingCourseId && managingCourse && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark text-white border-secondary border-opacity-25">
              <div className="modal-header border-secondary border-opacity-25">
                <h5 className="modal-title fw-bold">Conteúdo: {managingCourse.title}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setManagingCourseId(null)}></button>
              </div>
              <div className="modal-body">
                {/* Adicionar Módulo */}
                <form onSubmit={handleAddModule} className="d-flex gap-2 mb-4">
                  <input 
                    type="text" 
                    className="form-control glass-input text-white" 
                    placeholder="Nome do Novo Módulo..." 
                    value={newModuleTitle}
                    onChange={e => setNewModuleTitle(e.target.value)}
                    required 
                  />
                  <button type="submit" className="btn btn-success text-nowrap">+ Módulo</button>
                </form>

                <div className="accordion" id="modulesAccordion">
                  {managingCourse.modules.length === 0 && <p className="text-secondary">Nenhum módulo cadastrado.</p>}
                  {managingCourse.modules.map((m, index) => (
                    <div className="accordion-item bg-transparent border-secondary border-opacity-25 mb-2" key={m.id}>
                      <h2 className="accordion-header d-flex" id={`heading-${m.id}`}>
                        <button className="accordion-button bg-dark bg-opacity-50 text-white collapsed shadow-none border-0" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${m.id}`}>
                          <span className="fw-bold me-auto">{m.title}</span>
                          <span className="badge bg-secondary me-3">{m.lessons.length} aulas</span>
                        </button>
                        <button className="btn btn-sm btn-danger rounded-0 px-3" onClick={() => handleDeleteModule(m.id)}>Excluir</button>
                      </h2>
                      <div id={`collapse-${m.id}`} className="accordion-collapse collapse" data-bs-parent="#modulesAccordion">
                        <div className="accordion-body bg-black bg-opacity-25">
                          {/* Listar Aulas */}
                          {m.lessons.length > 0 ? (
                            <ul className="list-group list-group-flush mb-3">
                              {m.lessons.map(l => (
                                <li className="list-group-item bg-transparent text-light border-secondary border-opacity-10 d-flex justify-content-between align-items-center" key={l.id}>
                                  <div className="text-truncate me-2">
                                    <span className="fw-semibold">{l.title}</span><br/>
                                    <small className="text-secondary text-truncate d-inline-block" style={{maxWidth: '300px'}}>{l.videoUrl}</small>
                                  </div>
                                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteLesson(l.id)}>Remover</button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-secondary small">Este módulo não possui aulas ainda.</p>
                          )}

                          {/* Formulario Adicionar Aula */}
                          {addingLessonToModId === m.id ? (
                            <form onSubmit={(e) => handleAddLesson(e, m.id)} className="bg-dark p-3 rounded-3 border border-secondary border-opacity-25 mt-2">
                              <h6 className="fw-bold mb-3 small">Nova Aula</h6>
                              <div className="mb-2">
                                <input type="text" className="form-control form-control-sm glass-input text-white" placeholder="Título da aula" value={newLessonTitle} onChange={e => setNewLessonTitle(e.target.value)} required />
                              </div>
                              <div className="mb-3">
                                <input type="url" className="form-control form-control-sm glass-input text-white" placeholder="URL do YouTube (ex: https://youtube.com/...)" value={newLessonUrl} onChange={e => setNewLessonUrl(e.target.value)} required />
                              </div>
                              <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-sm btn-primary">Salvar Aula</button>
                                <button type="button" className="btn btn-sm btn-secondary" onClick={() => setAddingLessonToModId(null)}>Cancelar</button>
                              </div>
                            </form>
                          ) : (
                            <button className="btn btn-sm btn-outline-success w-100 mt-2" onClick={() => setAddingLessonToModId(m.id)}>
                              + Adicionar Aula
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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

      {/* Categorias Tab */}
      {activeTab === 'categories' && (
        <div className="row g-4">
          <div className="col-md-4">
            <div className="glass-panel p-4 rounded-4 h-100">
              <h5 className="text-white fw-bold mb-4">Nova Categoria</h5>
              <form onSubmit={handleAddCategory}>
                <div className="mb-3">
                  <label className="form-label text-secondary small">ID da Categoria (ex: prog)</label>
                  <input type="text" className="form-control glass-input text-white" value={newCategoryId} onChange={e => setNewCategoryId(e.target.value)} required />
                </div>
                <div className="mb-4">
                  <label className="form-label text-secondary small">Nome da Categoria (ex: Programação)</label>
                  <input type="text" className="form-control glass-input text-white" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-premium-primary w-100">Criar Categoria</button>
              </form>
            </div>
          </div>
          <div className="col-md-8">
            <div className="glass-panel p-4 rounded-4 h-100">
              <h5 className="text-white fw-bold mb-4">Categorias ({categories.length})</h5>
              <div className="table-responsive">
                <table className="table table-dark table-hover bg-transparent">
                  <thead>
                    <tr>
                      <th className="bg-transparent text-secondary border-secondary border-opacity-25">ID</th>
                      <th className="bg-transparent text-secondary border-secondary border-opacity-25">Nome</th>
                      <th className="bg-transparent text-secondary border-secondary border-opacity-25">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(c => (
                      <tr key={c.id}>
                        <td className="bg-transparent border-secondary border-opacity-25">{c.id}</td>
                        <td className="bg-transparent border-secondary border-opacity-25 fw-bold">
                          {editingCategoryId === c.id ? (
                            <form onSubmit={handleUpdateCategory} className="d-flex gap-2">
                              <input type="text" className="form-control form-control-sm glass-input text-white" value={editCategoryName} onChange={e => setEditCategoryName(e.target.value)} required />
                              <button type="submit" className="btn btn-sm btn-success">Salvar</button>
                              <button type="button" className="btn btn-sm btn-secondary" onClick={() => setEditingCategoryId(null)}>X</button>
                            </form>
                          ) : (
                            c.name
                          )}
                        </td>
                        <td className="bg-transparent border-secondary border-opacity-25">
                          {editingCategoryId !== c.id && (
                            <div className="d-flex gap-2">
                              <button className="btn btn-sm btn-outline-info" onClick={() => startEditCategory(c)}>Editar</button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => deleteCategory(c.id)}>Excluir</button>
                            </div>
                          )}
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
    </div>
  );
}
