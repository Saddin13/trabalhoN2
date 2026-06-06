import { useAuth } from '../contexts/AuthContext';
import { Award, Download } from 'lucide-react';

export default function Certificates() {
  const { user } = useAuth();

  if (!user) return null;

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
            <div className="col-md-6 col-lg-4" key={cert.id}>
              <div className="premium-card p-4 h-100 position-relative text-center">
                <div className="mb-4">
                  <div className="mx-auto bg-primary bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                    <Award size={40} className="text-primary" />
                  </div>
                </div>
                
                <h5 className="text-white fw-bold mb-2">Certificado de Conclusão</h5>
                <p className="text-secondary small mb-4">
                  Certificamos que <strong>{user.name}</strong> concluiu o curso <strong>{cert.courseTitle}</strong>.
                </p>

                <div className="d-flex align-items-center justify-content-between text-secondary small mb-4 px-3 py-2 bg-dark bg-opacity-50 rounded-3">
                  <span>Data de Emissão:</span>
                  <strong className="text-white">{new Date(cert.issueDate).toLocaleDateString()}</strong>
                </div>

                <button 
                  className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => alert('Funcionalidade de download do PDF em desenvolvimento.')}
                >
                  <Download size={16} /> Baixar PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
