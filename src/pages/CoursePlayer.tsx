import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle, ChevronRight, Award } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Lesson } from '../types';

import YouTube, { YouTubeProps } from 'react-youtube';

// Helper para extrair o ID do vídeo da URL
const extractVideoId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
  return match ? match[1] : null;
};

export default function CoursePlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { courses } = useData();
  const { user, completeLesson, issueCertificate } = useAuth();
  const { showToast } = useToast();
  const [selectedVideo, setSelectedVideo] = useState<Lesson | null>(null);

  const course = useMemo(() => courses.find(c => c.id === id), [id, courses]);

  // Verificar e emitir certificado se 100%
  useEffect(() => {
    if (!course || !user) return;
    const totalLessons = course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);
    const courseLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
    const completedForThisCourse = user.completedLessons.filter(lId => courseLessonIds.includes(lId));
    
    if (totalLessons > 0 && completedForThisCourse.length === totalLessons) {
      issueCertificate(course.id, course.title);
    }
  }, [user?.completedLessons, course, user, issueCertificate]);

  if (!course || !user || !user.enrolledCourses.includes(course.id)) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-panel p-5 rounded-4 border border-danger border-opacity-10 d-inline-block">
          <h2 className="text-white fw-bold">Acesso Negado</h2>
          <p className="text-secondary">Você não está matriculado neste curso ou ele não existe.</p>
          <button onClick={() => navigate('/aulas')} className="btn btn-premium-primary mt-3">
            Voltar para Minhas Aulas
          </button>
        </div>
      </div>
    );
  }

  const totalLessonsCount = course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);

  const handleToggleLesson = (lessonId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    completeLesson(lessonId, course.id, totalLessonsCount, course.title);
  };

  const handlePlayVideo = (lesson: Lesson) => {
    if (lesson.videoUrl) {
      setSelectedVideo(lesson);
    } else {
      showToast("Nenhum vídeo disponível para esta aula.", "error");
    }
  };

  const onPlayerEnd: YouTubeProps['onEnd'] = (event) => {
    if (selectedVideo && !user.completedLessons.includes(selectedVideo.id)) {
      handleToggleLesson(selectedVideo.id);
      showToast("Aula concluída automaticamente!", "success");
    }
  };

  const videoId = selectedVideo ? extractVideoId(selectedVideo.videoUrl) : null;

  return (
    <div className="container-fluid px-4 py-4 position-relative">
      <div className="d-flex align-items-center mb-4 gap-2 text-secondary">
        <button 
          onClick={() => navigate('/aulas')} 
          className="btn btn-link text-secondary p-0 d-flex align-items-center gap-1 text-decoration-none border-0 fs-6 hover-white"
        >
          <ArrowLeft size={16} /> Minhas Aulas
        </button>
        <ChevronRight size={14} className="text-muted" />
        <span className="text-muted text-truncate" style={{ maxWidth: '250px' }}>{course.title}</span>
      </div>

      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="glass-panel p-4 rounded-4 mb-4">
            <h2 className="display-font text-white mb-2">{course.title}</h2>
            <p className="text-secondary mb-4">Acompanhe seu progresso e assista as aulas.</p>

            <div className="accordion" id="playerAccordion">
              {course.modules.map((mod, idx) => (
                <div className="accordion-item accordion-item-premium" key={mod.id}>
                  <h2 className="accordion-header">
                    <button 
                      className={`accordion-button accordion-button-premium ${idx !== 0 ? 'collapsed' : ''}`}
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target={`#player-collapse-${mod.id}`}
                    >
                      <div className="w-100 text-start pr-3">
                        <div className="fw-bold fs-6">{mod.title}</div>
                      </div>
                    </button>
                  </h2>
                  <div 
                    id={`player-collapse-${mod.id}`} 
                    className={`accordion-collapse collapse ${idx === 0 ? 'show' : ''}`} 
                    data-bs-parent="#playerAccordion"
                  >
                    <div className="accordion-body accordion-body-premium p-0">
                      <div className="list-group list-group-flush bg-transparent">
                        {mod.lessons.map(lesson => {
                          const isCompleted = user.completedLessons.includes(lesson.id);
                          return (
                            <div 
                              key={lesson.id} 
                              className="list-group-item bg-transparent border-bottom border-secondary border-opacity-25 px-4 py-3 d-flex align-items-center justify-content-between hover-bg-elevated cursor-pointer"
                              onClick={() => handlePlayVideo(lesson)}
                              style={{ transition: 'background 0.2s ease', cursor: 'pointer' }}
                            >
                              <div className="d-flex align-items-center gap-3">
                                <button 
                                  className="btn btn-link p-0 text-decoration-none" 
                                  onClick={(e) => handleToggleLesson(lesson.id, e)}
                                >
                                  {isCompleted ? (
                                    <CheckCircle size={24} fill="#10B981" className="text-white" />
                                  ) : (
                                    <div className="border border-secondary border-opacity-50 rounded-circle" style={{ width: '24px', height: '24px' }}></div>
                                  )}
                                </button>
                                
                                <span className={`text-white`}>
                                  {lesson.title}
                                </span>
                              </div>
                              <div className="d-flex align-items-center gap-3">
                                <span className="badge bg-secondary bg-opacity-20 text-secondary small px-2 py-1">
                                  {lesson.duration}
                                </span>
                                <Play size={18} className="text-info" />
                              </div>
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
      </div>

      {/* Video Modal Overlay */}
      {selectedVideo && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 1050 }}>
          <div className="w-100 rounded-4" style={{ maxWidth: '900px', padding: '24px', backgroundColor: '#0B0F19', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-white mb-0 fw-bold">{selectedVideo.title}</h4>
              <button className="btn-close btn-close-white" onClick={() => setSelectedVideo(null)}></button>
            </div>
            <div className="ratio ratio-16x9 rounded-4 overflow-hidden shadow-lg border border-secondary border-opacity-25 bg-black">
              {videoId ? (
                <YouTube 
                  videoId={videoId} 
                  onEnd={onPlayerEnd} 
                  opts={{ width: '100%', height: '100%', playerVars: { autoplay: 1 } }} 
                  className="w-100 h-100"
                />
              ) : (
                <iframe 
                  src={selectedVideo.videoUrl} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              )}
            </div>
            <div className="mt-4 text-center">
              <button 
                className="btn btn-premium-primary"
                onClick={(e) => {
                  if (!user.completedLessons.includes(selectedVideo.id)) {
                    handleToggleLesson(selectedVideo.id, e as any);
                  }
                  setSelectedVideo(null);
                }}
              >
                Marcar como Concluída Manualmente e Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
