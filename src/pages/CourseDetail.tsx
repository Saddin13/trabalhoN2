import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, Clock, Users, Award, Shield, Smartphone, ChevronRight, CheckCircle
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { courses } = useData();
  const { user, enrollCourse } = useAuth();
  
  const course = useMemo(() => {
    return courses.find(c => c.id === id);
  }, [id, courses]);

  if (!course) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-panel p-5 rounded-4 border border-danger border-opacity-10 d-inline-block">
          <h2 className="text-white fw-bold">Curso não encontrado</h2>
          <p className="text-secondary">O curso que você está tentando acessar não existe em nossa base de dados.</p>
          <button onClick={() => navigate('/')} className="btn btn-premium-primary btn-sm mt-3">
            Voltar ao Catálogo
          </button>
        </div>
      </div>
    );
  }

  const isEnrolled = user?.enrolledCourses.includes(course.id) || false;

  const handleEnroll = () => {
    if (!user) {
      alert('Você precisa criar uma conta ou fazer login para comprar este curso.');
      return;
    }
    enrollCourse(course.id);
    alert('Matrícula realizada com sucesso! Você pode assistir às aulas na aba "Aulas".');
  };

  const totalLessonsCount = course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);

  return (
    <div className="container-fluid px-4 py-4">
      {/* Breadcrumb Navigation */}
      <div className="d-flex align-items-center mb-4 gap-2 text-secondary">
        <button 
          onClick={() => navigate('/cursos')} 
          className="btn btn-link text-secondary p-0 d-flex align-items-center gap-1 text-decoration-none border-0 fs-6 hover-white"
        >
          <ArrowLeft size={16} /> Catálogo
        </button>
        <ChevronRight size={14} className="text-muted" />
        <span className="text-muted text-truncate" style={{ maxWidth: '250px' }}>{course.title}</span>
      </div>

      <div className="row g-4">
        {/* Left Column: Course Info */}
        <div className="col-lg-8">
          <div className="glass-panel p-4 p-md-5 rounded-4 mb-4 border border-secondary border-opacity-10 position-relative">
            <h1 className="display-5 fw-extrabold text-white mb-3">{course.title}</h1>
            <p className="lead text-secondary mb-4">{course.description}</p>

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

          {/* Ementa do Curso */}
          <div className="glass-panel p-4 rounded-4 mb-4">
            <h4 className="display-font text-white mb-4">O que você vai aprender</h4>
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
                    >
                      <div className="w-100 text-start pr-3">
                        <div className="fw-bold fs-6">{mod.title}</div>
                        <small className="text-secondary fw-normal">
                          {mod.lessons.length} aulas
                        </small>
                      </div>
                    </button>
                  </h2>
                  <div 
                    id={`collapse-${mod.id}`} 
                    className={`accordion-collapse collapse ${idx === 0 ? 'show' : ''}`} 
                    data-bs-parent="#syllabusAccordion"
                  >
                    <div className="accordion-body accordion-body-premium p-0">
                      <ul className="list-group list-group-flush bg-transparent">
                        {mod.lessons.map(lesson => (
                          <li key={lesson.id} className="list-group-item bg-transparent border-secondary border-opacity-25 text-white d-flex justify-content-between">
                            <span><CheckCircle size={14} className="text-info me-2" /> {lesson.title}</span>
                            <span className="text-muted small">{lesson.duration}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Buying logic */}
        <div className="col-lg-4">
          <div className="position-sticky" style={{ top: '2rem' }}>
            <div className="glass-panel p-4 rounded-4 mb-4 border border-secondary border-opacity-10">
              <div className="premium-card-img-wrapper rounded-3 mb-4">
                <img src={course.image} alt={course.title} className="w-100" style={{ height: '180px', objectFit: 'cover' }} />
              </div>

              <div className="d-grid gap-3">
                {isEnrolled ? (
                  <button onClick={() => navigate('/aulas')} className="btn btn-premium-primary py-3">
                    Ir para Minhas Aulas
                  </button>
                ) : (
                  <button onClick={handleEnroll} className="btn btn-premium-primary py-3">
                    Comprar Curso / Matricular
                  </button>
                )}
              </div>

              {/* Checklist items */}
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

            {/* Instructor Profile */}
            <div className="glass-panel p-4 rounded-4">
              <h5 className="display-font text-white mb-3">Instrutor Responsável</h5>
              <div className="d-flex align-items-center gap-3 mb-3 text-start">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4 text-white" 
                  style={{ width: '60px', height: '60px', background: 'var(--primary-gradient)', minWidth: '60px' }}
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
