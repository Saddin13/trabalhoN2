import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession } from '../services/authService';
import { fetchAllData } from '../services/dataService';
import { Course } from '../types';

export default function MyCourses() {
  const user = getSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAllData();
        setCourses(data.courses);
      } catch (e) {
        console.error(e);
      }
    }
    load();
    const handleDataChange = () => load();
    window.addEventListener('data_change', handleDataChange);
    return () => window.removeEventListener('data_change', handleDataChange);
  }, []);

  if (!user) return null;

  const enrolledCourses = courses.filter(c => user.enrolledCourses.includes(c.id));

  const calculateProgress = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return 0;
    
    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    if (totalLessons === 0) return 0;

    // Obter todas as lessons deste curso
    const courseLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
    const completedForThisCourse = user.completedLessons.filter(id => courseLessonIds.includes(id));
    
    return Math.round((completedForThisCourse.length / totalLessons) * 100);
  };

  return (
    <div className="container-fluid px-4 py-4">
      <h2 className="display-font fw-bold text-white mb-4">Minhas Aulas</h2>
      <p className="text-secondary mb-5">Continue seu aprendizado de onde parou.</p>

      {enrolledCourses.length === 0 ? (
        <div className="glass-panel p-5 text-center rounded-4 border border-dashed border-secondary border-opacity-25">
          <i className="bi bi-book fs-1 text-muted mb-3 d-block"></i>
          <h4 className="text-white fw-bold">Nenhum curso adquirido</h4>
          <p className="text-secondary">Você ainda não se matriculou em nenhum curso.</p>
          <button onClick={() => navigate('/cursos')} className="btn btn-premium-primary mt-3">
            Explorar Catálogo
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {enrolledCourses.map(course => {
            const progress = calculateProgress(course.id);
            return (
              <div key={course.id} className="col-md-6 col-lg-4">
                <div className="premium-card p-4 d-flex flex-column gap-3 justify-content-between h-100">
                  <div>
                    <h5 className="text-white fw-bold mb-2">{course.title}</h5>
                    <p className="text-secondary small mb-3 text-truncate-2">{course.description}</p>
                    
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="small text-secondary">Progresso:</span>
                      <span className="small text-primary fw-bold">{progress}%</span>
                    </div>
                    <div className="progress bg-dark bg-opacity-50" style={{ height: '6px', borderRadius: '3px' }}>
                      <div 
                        className="progress-bar bg-primary" 
                        style={{ width: `${progress}%`, backgroundImage: 'var(--primary-gradient)' }}
                      ></div>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate(`/aulas/${course.id}`)} 
                    className="btn btn-premium-secondary w-100 mt-2 d-flex align-items-center justify-content-center gap-2"
                  >
                    <i className="bi bi-play-fill"></i> Assistir Aulas
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
