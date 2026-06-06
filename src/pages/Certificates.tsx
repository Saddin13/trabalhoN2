import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Award, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export default function Certificates() {
  const { user } = useAuth();
  const { courses } = useData();
  const { showToast } = useToast();

  if (!user) return null;

  const getCourseTitle = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'Formação Completa';
  };

  return (
    <div className="container-fluid px-4 py-4">
      <h2 className="display-font fw-bold text-white mb-4">Meus Certificados</h2>
      <p className="text-secondary mb-5">Suas conquistas acadêmicas com validade e comprovação.</p>

      {user.certificates.length === 0 ? (
        <div className="glass-panel p-5 text-center rounded-4 border border-dashed border-secondary border-opacity-25">
          <Award size={64} className="text-muted mb-3" />
          <h4 className="text-white fw-bold">Nenhum certificado emitido</h4>
          <p className="text-secondary mx-auto" style={{ maxWidth: '400px' }}>
            Complete 100% de um curso para emitir automaticamente seu certificado de conclusão.
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {user.certificates.map(cert => (
            <div className="col-12" key={cert.id}>
              <div 
                className="premium-card p-0 overflow-hidden position-relative" 
                style={{ 
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {/* Estampa / Marca d'água */}
                <div 
                  className="position-absolute opacity-10" 
                  style={{ top: '-10%', right: '-5%', transform: 'rotate(15deg)' }}
                >
                  <Award size={300} color="#e2e8f0" />
                </div>

                <div className="row g-0">
                  <div className="col-md-8 p-4 p-md-5 z-1">
                    <div className="d-flex align-items-center gap-3 mb-4">
                      <div className="bg-primary bg-opacity-25 rounded-circle p-2">
                        <Award size={28} className="text-primary" />
                      </div>
                      <h4 className="text-white fw-bold mb-0 display-font">Saddi Estudos</h4>
                    </div>

                    <h5 className="text-primary tracking-wider text-uppercase small fw-bold mb-2">Certificado de Conclusão</h5>
                    <h2 className="text-white fw-extrabold mb-4" style={{ fontSize: '2.5rem' }}>
                      {getCourseTitle(cert.courseId)}
                    </h2>
                    
                    <p className="text-secondary fs-5 mb-4" style={{ lineHeight: '1.6' }}>
                      Certificamos que <strong className="text-white">{user.name}</strong> concluiu com êxito todas as aulas e atividades exigidas para esta formação.
                    </p>

                    <div className="d-flex flex-wrap gap-4 mt-5">
                      <div>
                        <p className="text-secondary small mb-1">Data de Emissão</p>
                        <strong className="text-white d-flex align-items-center gap-2">
                          <CheckCircle size={16} className="text-success" />
                          {new Date(cert.issueDate).toLocaleDateString()}
                        </strong>
                      </div>
                      <div>
                        <p className="text-secondary small mb-1">Código de Verificação</p>
                        <strong className="text-white d-flex align-items-center gap-2" style={{ fontFamily: 'monospace' }}>
                          <ShieldCheck size={16} className="text-info" />
                          {cert.verificationCode || 'VFY-VALIDO'}
                        </strong>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-4 bg-dark bg-opacity-50 border-start border-light border-opacity-10 p-4 p-md-5 d-flex flex-column justify-content-center align-items-center text-center z-1">
                    <div className="mb-4">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Verificacao:${cert.verificationCode || 'VALIDO'}&bgcolor=0f172a&color=ffffff`} alt="QR Code" className="img-fluid rounded-3 border border-secondary border-opacity-25 p-2 bg-dark" />
                    </div>
                    <p className="text-secondary small mb-4">
                      Aponte a câmera para verificar a autenticidade deste certificado.
                    </p>
                    <button 
                      className="btn btn-premium-primary w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                      onClick={() => showToast('Iniciando download do PDF do certificado...', 'success')}
                    >
                      <Download size={18} />
                      Baixar Certificado
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
