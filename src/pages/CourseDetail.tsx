import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Users, 
  Award, 
  Bookmark, 
  Play, 
  CheckCircle, 
  HelpCircle,
  Shield,
  Smartphone,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { COURSES_DATA } from '../data/coursesData';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find target course
  const course = useMemo(() => {
    return COURSES_DATA.find(c => c.id === id);
  }, [id]);

  // State management for interactive enrollment & completion simulation
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  // Calculate total lessons
  const totalLessonsCount = useMemo(() => {
    if (!course) return 0;
    return course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);
  }, [course]);

  // Calculate dynamic progress percentage
  const progressPercent = useMemo(() => {
    if (totalLessonsCount === 0) return 0;
    return Math.round((completedLessons.length / totalLessonsCount) * 100);
  }, [completedLessons, totalLessonsCount]);

  if (!course) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-panel p-5 rounded-4 border border-danger border-opacity-10 d-inline-block">
          <HelpCircle size={64} className="text-danger mb-3" />
          <h2 className="text-white fw-bold">Curso não encontrado</h2>
          <p className="text-secondary">O curso que você está tentando acessar não existe em nossa base de dados.</p>
          <button onClick={() => navigate('/')} className="btn btn-premium-primary btn-sm mt-3">
            Voltar ao Catálogo
          </button>
        </div>
      </div>
    );
  }

  // Toggle a lesson's completed status
  const toggleLesson = (lessonId: string) => {
    if (!isEnrolled) return; // Prevent completion if not enrolled
    setCompletedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId) 
        : [...prev, lessonId]
    );
  };

  return (
    <div className="container-fluid px-4 py-4">
      {/* Breadcrumb Navigation */}
      <div className="d-flex align-items-center mb-4 gap-2 text-secondary">
        <button 
          onClick={() => navigate('/')} 
          className="btn btn-link text-secondary p-0 d-flex align-items-center gap-1 text-decoration-none border-0 fs-6 hover-white"
          style={{ transition: 'color 0.2s ease' }}
        >
          <ArrowLeft size={16} /> Catálogo
        </button>
        <ChevronRight size={14} className="text-muted" />
        <span className="text-muted text-truncate" style={{ maxWidth: '250px' }}>{course.title}</span>
      </div>

      <div className="row g-4">
        {/* Left Column: Immersive Header & Accordion Syllabus */}
        <div className="col-lg-8">
          <div className="glass-panel p-4 p-md-5 rounded-4 mb-4 border border-secondary border-opacity-10 position-relative">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
              <span className={`badge ${
                course.category === 'programming' ? 'badge-category-prog' :
                course.category === 'design' ? 'badge-category-design' :
                'badge-category-data'
              } px-3 py-1.5 rounded-pill`}>
                {course.category === 'programming' ? 'Programação' :
                 course.category === 'design' ? 'Design' : 'Dados'}
              </span>
              <span className="badge bg-secondary bg-opacity-25 text-white px-3 py-1.5 rounded-pill border border-light border-opacity-10">
                {course.level}
              </span>
            </div>

            <h1 className="display-5 fw-extrabold text-white mb-3">{course.title}</h1>
            <p className="lead text-secondary mb-4">{course.description}</p>

            {/* Course Quick Stats Row */}
            <div className="row g-3 text-secondary pt-3 border-top border-light border-opacity-10">
              <div className="col-sm-4 d-flex align-items-center gap-2">
                <Star size={18} fill="#F59E0B" className="text-warning" />
                <div>
                  <strong className="text-white d-block">{course.rating} de 5.0</strong>
                  <span className="small">Avaliações reais</span>
                </div>
              </div>
              <div className="col-sm-4 d-flex align-items-center gap-2">
                <Users size={18} className="text-primary" />
                <div>
                  <strong className="text-white d-block">{course.studentsCount.toLocaleString()}</strong>
                  <span className="small">Alunos matriculados</span>
                </div>
              </div>
              <div className="col-sm-4 d-flex align-items-center gap-2">
                <Clock size={18} className="text-info" />
                <div>
                  <strong className="text-white d-block">{course.duration}</strong>
                  <span className="small">Carga horária total</span>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="glass-panel p-4 rounded-4 mb-4">
            <h4 className="display-font text-white mb-3">Sobre esta Formação</h4>
            <p className="text-secondary" style={{ lineHeight: '1.7', whiteSpace: 'pre-line' }}>
              {course.longDescription}
            </p>
          </div>

          {/* Interactive Dynamic Curriculum Syllabus */}
          <div className="glass-panel p-4 rounded-4 mb-4">
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
              <div>
                <h4 className="display-font text-white mb-0">Grade Curricular</h4>
                <p className="text-secondary small mb-0">Explore os módulos e gerencie o progresso das aulas</p>
              </div>
              <div className="badge bg-secondary bg-opacity-25 text-white border border-light border-opacity-10 px-3 py-2 rounded-3">
                {course.modulesCount} Módulos • {totalLessonsCount} Aulas
              </div>
            </div>

            {/* Course Enrollment Alert Tip */}
            {!isEnrolled && (
              <div className="alert bg-primary bg-opacity-10 border border-primary border-opacity-20 text-white rounded-3 mb-4 d-flex align-items-start gap-3">
                <div className="bg-primary bg-opacity-25 p-2 rounded-2 text-primary mt-1">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Dica de Aprendizado</h6>
                  <p className="small text-secondary mb-0">
                    Realize sua matrícula na barra lateral direita para poder interagir com a grade, assistir às aulas e marcar seu progresso em tempo real!
                  </p>
                </div>
              </div>
            )}

            {/* Accordion Component */}
            <div className="accordion" id="syllabusAccordion">
              {course.modules.map((mod, idx) => (
                <div className="accordion-item accordion-item-premium" key={mod.id}>
                  <h2 className="accordion-header">
                    <button 
                      className={`accordion-button accordion-button-premium ${idx !== 0 ? 'collapsed' : ''}`}
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target={`#collapse-${mod.id}`}
                      aria-expanded={idx === 0 ? 'true' : 'false'} 
                      aria-controls={`collapse-${mod.id}`}
                    >
                      <div className="w-100 text-start pr-3">
                        <div className="fw-bold fs-6">{mod.title}</div>
                        <small className="text-secondary fw-normal">
                          {mod.lessons.length} aulas • Práticas & Teóricas
                        </small>
                      </div>
                    </button>
                  </h2>
                  <div 
                    id={`collapse-${mod.id}`} 
                    className={`accordion-collapse collapse ${idx === 0 ? 'show' : ''}`} 
                    data-bs-parent="#syllabusAccordion"
                  >
                    <div className="accordion-body accordion-body-premium">
                      <div className="list-group list-group-flush bg-transparent">
                        {mod.lessons.map((lesson) => {
                          const isCompleted = completedLessons.includes(lesson.id);
                          return (
                            <div 
                              key={lesson.id} 
                              className={`list-group-item bg-transparent border-0 px-0 py-3 d-flex align-items-center justify-content-between rounded-3 transition-colors ${
                                isEnrolled ? 'cursor-pointer hover-bg-elevated' : ''
                              }`}
                              onClick={() => toggleLesson(lesson.id)}
                              style={{ 
                                cursor: isEnrolled ? 'pointer' : 'default',
                                transition: 'background 0.2s ease',
                                paddingLeft: '0.75rem',
                                paddingRight: '0.75rem'
                              }}
                            >
                              <div className="d-flex align-items-center gap-3">
                                {isEnrolled ? (
                                  isCompleted ? (
                                    <CheckCircle size={20} fill="#10B981" className="text-white" />
                                  ) : (
                                    <div className="border border-secondary border-opacity-50 rounded-circle" style={{ width: '20px', height: '20px' }}></div>
                                  )
                                ) : (
                                  <Play size={16} className="text-muted" />
                                )}
                                <span className={`small ${isCompleted ? 'text-decoration-line-through text-muted' : 'text-white'}`}>
                                  {lesson.title}
                                </span>
                              </div>
                              <span className="badge bg-secondary bg-opacity-20 text-secondary small px-2 py-1">
                                {lesson.duration}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Action Control & Instructor Panel */}
        <div className="col-lg-4">
          <div className="position-sticky" style={{ top: '2rem' }}>
            
            {/* Enrollment Control Board */}
            <div className="glass-panel p-4 rounded-4 mb-4 border border-secondary border-opacity-10">
              <div className="premium-card-img-wrapper rounded-3 mb-4">
                <img src={course.image} alt={course.title} className="w-100" style={{ height: '180px', objectFit: 'cover' }} />
              </div>

              {/* Progress Tracking Bar (Only active when enrolled) */}
              {isEnrolled && (
                <div className="mb-4">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="small text-secondary fw-semibold">Seu Progresso</span>
                    <span className="small text-primary fw-bold">{progressPercent}%</span>
                  </div>
                  <div className="progress bg-dark bg-opacity-50" style={{ height: '8px', borderRadius: '4px' }}>
                    <div 
                      className="progress-bar bg-primary" 
                      role="progressbar" 
                      style={{ 
                        width: `${progressPercent}%`, 
                        backgroundImage: 'var(--primary-gradient)',
                        borderRadius: '4px',
                        transition: 'width 0.4s ease'
                      }} 
                      aria-valuenow={progressPercent} 
                      aria-valuemin={0} 
                      aria-valuemax={100}
                    ></div>
                  </div>
                  <small className="text-muted mt-2 d-block text-center">
                    {completedLessons.length} de {totalLessonsCount} aulas assistidas
                  </small>
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-grid gap-3">
                {isEnrolled ? (
                  <button 
                    onClick={() => {
                      if (progressPercent === 100) {
                        alert('Parabéns! Você concluiu a formação e seu certificado digital de excelência está sendo emitido!');
                      } else {
                        alert('Selecione as aulas concluídas marcando os círculos na grade curricular ao lado para simular o aprendizado!');
                      }
                    }} 
                    className="btn btn-premium-primary py-3"
                  >
                    {progressPercent === 100 ? 'Reivindicar Certificado 🏆' : 'Continuar Aprendizado'}
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEnrolled(true)} 
                    className="btn btn-premium-primary py-3"
                  >
                    Matricular-se Grátis
                  </button>
                )}

                <div className="row g-2">
                  <div className="col-12">
                    <button 
                      onClick={() => setIsSaved(prev => !prev)} 
                      className="btn btn-premium-secondary w-100 py-2.5 d-flex align-items-center justify-content-center gap-2"
                    >
                      <Bookmark size={18} fill={isSaved ? '#A855F7' : 'none'} className={isSaved ? 'text-primary' : 'text-secondary'} /> 
                      {isSaved ? 'Salvo nos Favoritos' : 'Salvar nos Favoritos'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Access checklist items */}
              <div className="border-top border-light border-opacity-10 mt-4 pt-4 text-start">
                <h6 className="text-white fw-bold mb-3 small text-uppercase tracking-wider">Esta formação inclui:</h6>
                <div className="d-grid gap-2.5">
                  <div className="d-flex align-items-center gap-2.5 text-secondary small">
                    <Award size={16} className="text-primary" />
                    <span>Acesso vitalício ao material</span>
                  </div>
                  <div className="d-flex align-items-center gap-2.5 text-secondary small">
                    <Shield size={16} className="text-info" />
                    <span>Certificado de Conclusão Assinado</span>
                  </div>
                  <div className="d-flex align-items-center gap-2.5 text-secondary small">
                    <Smartphone size={16} className="text-warning" />
                    <span>Compatível com Web e Mobile</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructor Profile glass-panel */}
            <div className="glass-panel p-4 rounded-4">
              <h5 className="display-font text-white mb-3">Instrutor Responsável</h5>
              <div className="d-flex align-items-center gap-3 mb-3 text-start">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4 text-white" 
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    background: 'var(--primary-gradient)',
                    minWidth: '60px'
                  }}
                >
                  {course.instructorName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h6 className="mb-0 fw-bold text-white">{course.instructorName}</h6>
                  <span className="small text-primary fw-medium">{course.instructorRole}</span>
                </div>
              </div>
              <p className="text-secondary small mb-0" style={{ lineHeight: '1.6' }}>
                {course.instructorBio}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
