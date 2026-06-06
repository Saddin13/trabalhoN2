import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, BookOpen, Clock, Users, Star, ArrowRight, GraduationCap, TrendingUp, Award 
} from 'lucide-react';
import { useData } from '../contexts/DataContext';

export default function Home() {
  const navigate = useNavigate();
  const { courses, categories } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Interactive metrics calculation
  const totalStudents = useMemo(() => {
    return courses.reduce((acc, c) => acc + c.studentsCount, 0);
  }, [courses]);

  const totalHours = useMemo(() => {
    return courses.reduce((acc, c) => {
      const num = parseInt(c.duration.replace(/\D/g, ''));
      return acc + (isNaN(num) ? 0 : num);
    }, 0);
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.instructorName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = activeFilter === 'all' || course.category === activeFilter;

      return matchesSearch && matchesCategory;
    });
  }, [courses, searchTerm, activeFilter]);

  return (
    <div className="container-fluid px-4 py-4">
      {/* Dynamic Immersive Hero Banner */}
      <div className="hero-glow-box p-4 p-md-5 mb-5 rounded-4 border border-secondary border-opacity-10 position-relative overflow-hidden">
        <div className="row align-items-center position-relative z-3">
          <div className="col-lg-7 text-start">
            <span className="badge bg-primary bg-opacity-25 text-primary-emphasis mb-3 px-3 py-2 rounded-pill font-display fw-semibold border border-primary border-opacity-20">
              🚀 Nova Era Acadêmica
            </span>
            <h1 className="display-4 fw-extrabold mb-3 text-white">
              Sua jornada de <span className="text-transparent bg-clip-text bg-gradient-to-r text-primary" style={{ backgroundImage: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Alta Performance</span> começa aqui
            </h1>
            <p className="lead text-secondary mb-4 fs-5" style={{ maxWidth: '600px' }}>
              Explore programas de tecnologia aprofundados, desenvolvidos por líderes da indústria. Do zero ao nível sênior em engenharia de software, design e dados.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Link to="/paths" className="btn btn-premium-primary btn-lg px-5 shadow">
                Ver Trilhas
              </Link>
            </div>
          </div>
          <div className="col-lg-5 d-none d-lg-block text-center">
            <div className="p-3 bg-dark bg-opacity-40 rounded-4 border border-light border-opacity-10 glass-panel" style={{ transform: 'rotate(2deg)' }}>
              <div className="d-flex align-items-center gap-3 mb-3 text-start">
                <div className="bg-primary bg-opacity-25 p-2 rounded-3 text-primary">
                  <Award size={32} />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">Certificação de Excelência</h6>
                  <small className="text-secondary">Válida internacionalmente</small>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3 text-start">
                <div className="bg-info bg-opacity-25 p-2 rounded-3 text-info">
                  <TrendingUp size={32} />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">Aceleração de Carreira</h6>
                  <small className="text-secondary">92% de empregabilidade</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Visual Stats */}
      <div id="stats" className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="glass-panel p-4 rounded-4 text-center text-md-start d-flex align-items-center justify-content-between">
            <div>
              <p className="text-white text-uppercase small mb-1 fw-bold tracking-wider">Cursos Disponíveis</p>
              <h2 className="mb-0 display-font fw-extrabold text-white">{courses.length}</h2>
            </div>
            <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-3">
              <BookOpen size={24} />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="glass-panel p-4 rounded-4 text-center text-md-start d-flex align-items-center justify-content-between">
            <div>
              <p className="text-white text-uppercase small mb-1 fw-bold tracking-wider">Alunos Ativos</p>
              <h2 className="mb-0 display-font fw-extrabold text-white">{totalStudents.toLocaleString()}+</h2>
            </div>
            <div className="bg-info bg-opacity-10 text-info p-3 rounded-3">
              <Users size={24} />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="glass-panel p-4 rounded-4 text-center text-md-start d-flex align-items-center justify-content-between">
            <div>
              <p className="text-white text-uppercase small mb-1 fw-bold tracking-wider">Conteúdo Gravado</p>
              <h2 className="mb-0 display-font fw-extrabold text-white">{totalHours} Horas</h2>
            </div>
            <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-3">
              <Clock size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Course Marketplace Section */}
      <div className="container" id="marketplace">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="display-font fw-bold mb-2 text-white">Catálogo de Cursos</h2>
            <p className="text-secondary mb-0">Expanda seus conhecimentos com nossos cursos especializados.</p>
          </div>
          
          <div className="d-flex gap-2 overflow-auto pb-2 custom-scroll">
            <button 
              className={`category-pill ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                className={`category-pill ${activeFilter === cat.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="position-relative">
            <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" size={20} />
            <input 
              type="text" 
              className="form-control glass-input ps-5 w-100" 
              placeholder="Pesquise por títulos, descrição ou instrutores..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>



      {/* Courses Cards Grid */}
      {filteredCourses.length > 0 ? (
        <div className="row g-4">
          {filteredCourses.map((course) => (
            <div className="col-xl-3 col-lg-4 col-md-6" key={course.id}>
              <div className="premium-card h-100">
                <div className="premium-card-img-wrapper">
                  <img 
                    src={course.image && course.image.startsWith('http') ? course.image : `https://picsum.photos/seed/${course.id}/600/400`} 
                    alt={course.title} 
                    className="premium-card-img"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/600x400/141B2D/FFFFFF?text=${encodeURIComponent(course.title)}`;
                    }}
                  />
                  {/* Category Badge overlay */}
                  <span className={`premium-card-badge ${
                    course.category === 'programming' ? 'badge-category-prog' :
                    course.category === 'design' ? 'badge-category-design' :
                    'badge-category-data'
                  }`}>
                    {course.category === 'programming' ? 'Programação' :
                     course.category === 'design' ? 'Design' : 'Dados'}
                  </span>
                </div>
                
                <div className="card-body p-4 d-flex flex-column justify-content-between flex-grow-1">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="badge bg-secondary bg-opacity-25 text-white small px-2 py-1 border border-light border-opacity-10">
                        {course.level}
                      </span>
                      <div className="d-flex align-items-center text-warning gap-1">
                        <Star size={16} fill="currentColor" />
                        <span className="small fw-bold">{course.rating}</span>
                      </div>
                    </div>

                    <h5 className="card-title text-white mb-2 text-truncate-2" style={{ minHeight: '48px', lineHeight: '1.3' }}>
                      {course.title}
                    </h5>
                    
                    <p className="card-text text-secondary small mb-4 text-truncate-3" style={{ minHeight: '60px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical' }}>
                      {course.description}
                    </p>
                  </div>

                  <div>
                    {/* Horizontal Line separating info */}
                    <div className="border-top border-light border-opacity-10 pt-3 mb-3">
                      <div className="row text-secondary g-0 text-center">
                        <div className="col-6 text-start d-flex align-items-center gap-2">
                          <Users size={16} className="text-primary" />
                          <span className="small fw-semibold">{course.studentsCount} alunos</span>
                        </div>
                        <div className="col-6 text-end d-flex align-items-center justify-content-end gap-2">
                          <Clock size={16} className="text-info" />
                          <span className="small fw-semibold">{course.duration}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => navigate(`/curso/${course.id}`)}
                      className="btn btn-premium-primary w-100 d-flex align-items-center justify-content-center gap-2"
                    >
                      Acessar Detalhes <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-5 text-center rounded-4 my-5 border border-dashed border-secondary border-opacity-25">
          <GraduationCap size={64} className="text-muted mb-3" />
          <h4 className="text-white fw-bold">Nenhum curso encontrado</h4>
          <p className="text-secondary mx-auto" style={{ maxWidth: '400px' }}>
            Não encontramos resultados para a sua busca ou filtros selecionados. Tente ajustar os termos ou selecionar outra categoria.
          </p>
          <button 
            onClick={() => { setSearchTerm(''); setActiveFilter('all'); }} 
            className="btn btn-premium-primary btn-sm mt-2"
          >
            Resetar Filtros
          </button>
        </div>
      )}
    </div>
  );
}

