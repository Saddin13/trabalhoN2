import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, PlayCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export default function Paths() {
  const { paths, courses } = useData();
  const navigate = useNavigate();

  return (
    <div className="container-fluid px-4 py-4">
      {/* Hero Section */}
      <div className="hero-glow-box p-4 p-md-5 mb-5 rounded-4 border border-secondary border-opacity-10 text-center">
        <h1 className="display-4 fw-extrabold mb-3 text-white">
          Trilhas de <span className="text-transparent bg-clip-text bg-gradient-to-r text-primary" style={{ backgroundImage: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Especialização</span>
        </h1>
        <p className="lead text-secondary mb-0 mx-auto" style={{ maxWidth: '700px' }}>
          Rotas de aprendizado desenhadas passo a passo. Do fundamento teórico à prática avançada, evolua na ordem recomendada por especialistas do mercado.
        </p>
      </div>

      {paths.length === 0 ? (
        <div className="glass-panel p-5 text-center rounded-4 border border-dashed border-secondary border-opacity-25 my-5">
          <BookOpen size={64} className="text-muted mb-3" />
          <h4 className="text-white fw-bold">Nenhuma trilha encontrada</h4>
          <p className="text-secondary mx-auto" style={{ maxWidth: '400px' }}>
            Ainda não há trilhas de aprendizado disponíveis.
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-5">
          {paths.map(path => {
            // Pegar os dados reais de cada curso da trilha
            const pathCourses = path.coursesIds
              .map(id => courses.find(c => c.id === id))
              .filter(Boolean) as typeof courses;

            return (
              <div key={path.id} className="glass-panel p-4 p-md-5 rounded-4 position-relative overflow-hidden">
                <div className="row align-items-center mb-5">
                  <div className="col-md-8">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="fs-1">{path.icon}</div>
                      <h2 className="display-font fw-bold text-white mb-0">{path.title}</h2>
                    </div>
                    <p className="text-secondary fs-5">{path.description}</p>
                  </div>
                  <div className="col-md-4 text-md-end mt-3 mt-md-0">
                    <div className="badge bg-primary bg-opacity-25 text-primary px-3 py-2 rounded-3 border border-primary border-opacity-20 fs-6">
                      {pathCourses.length} Cursos Recomendados
                    </div>
                  </div>
                </div>

                {/* Timeline de Cursos */}
                <div className="position-relative">
                  {/* Linha conectora (visível apenas em desktop) */}
                  <div className="d-none d-lg-block position-absolute bg-secondary bg-opacity-25" style={{ top: '50%', left: '0', right: '0', height: '4px', transform: 'translateY(-50%)', zIndex: 0 }}></div>

                  <div className="row g-4 position-relative z-3">
                    {pathCourses.map((course, index) => (
                      <div className="col-lg col-md-6" key={course.id}>
                        <div className="premium-card h-100 position-relative">
                          {/* Número do Passo */}
                          <div 
                            className="position-absolute top-0 start-50 translate-middle rounded-circle d-flex align-items-center justify-content-center bg-dark border border-primary text-primary fw-bold"
                            style={{ width: '40px', height: '40px', zIndex: 10, marginTop: '-10px' }}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-shrink-0" style={{ width: '100px', height: '100px' }}>
                            <img 
                              src={course.image && course.image.startsWith('http') ? course.image : `https://picsum.photos/seed/${course.id}/600/400`} 
                              alt={course.title} 
                              className="w-100 h-100 object-fit-cover rounded-3"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://placehold.co/100x100/141B2D/FFFFFF?text=Curso`;
                              }}
                            />
                          </div>
                          
                          <div className="card-body p-3 text-center d-flex flex-column justify-content-between h-100">
                            <div>
                              <span className="badge bg-dark bg-opacity-50 text-secondary mb-2 small">{course.level}</span>
                              <h6 className="card-title text-white fw-bold text-truncate-2 mb-3" style={{ minHeight: '40px' }}>
                                {course.title}
                              </h6>
                            </div>
                            <button 
                              onClick={() => navigate(`/curso/${course.id}`)}
                              className="btn btn-outline-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
                            >
                              Ver Detalhes <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
