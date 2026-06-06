import React, { useState } from 'react';
import { Course } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { CreditCard, Lock, CheckCircle2 } from 'lucide-react';

interface CheckoutModalProps {
  course: Course;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CheckoutModal({ course, onClose, onSuccess }: CheckoutModalProps) {
  const { enrollCourse } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment process
    setTimeout(async () => {
      await enrollCourse(course.id);
      showToast('Pagamento aprovado e matrícula realizada com sucesso!', 'success');
      setLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark text-white border-secondary border-opacity-25">
          <div className="modal-header border-secondary border-opacity-25">
            <h5 className="modal-title fw-bold d-flex align-items-center">
              <Lock className="me-2 text-warning" size={20} />
              Finalizar Compra Seguro
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} disabled={loading}></button>
          </div>
          <div className="modal-body">
            <div className="d-flex mb-4">
              <img 
                src={course.image && course.image.startsWith('http') ? course.image : `https://picsum.photos/seed/${course.id}/600/400`} 
                alt={course.title} 
                className="rounded" 
                style={{ width: '80px', height: '60px', objectFit: 'cover' }} 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/80x60/141B2D/FFFFFF?text=Curso`;
                }}
              />
              <div className="ms-3">
                <h6 className="fw-bold mb-1">{course.title}</h6>
                <p className="text-secondary small mb-0">Acesso Vitalício + Atualizações</p>
                <p className="text-success fw-bold mb-0">R$ 97,00</p>
              </div>
            </div>

            <form onSubmit={handlePayment}>
              <div className="mb-3">
                <label className="form-label text-secondary small">Nome no Cartão</label>
                <input type="text" className="form-control glass-input text-white" placeholder="NOME IMPRESSO NO CARTÃO" required disabled={loading} />
              </div>
              <div className="mb-3">
                <label className="form-label text-secondary small">Número do Cartão</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary border-opacity-25 text-secondary">
                    <CreditCard size={18} />
                  </span>
                  <input type="text" className="form-control glass-input text-white border-start-0" placeholder="0000 0000 0000 0000" maxLength={19} required disabled={loading} />
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-6">
                  <label className="form-label text-secondary small">Validade</label>
                  <input type="text" className="form-control glass-input text-white" placeholder="MM/AA" maxLength={5} required disabled={loading} />
                </div>
                <div className="col-6">
                  <label className="form-label text-secondary small">CVV</label>
                  <input type="text" className="form-control glass-input text-white" placeholder="123" maxLength={4} required disabled={loading} />
                </div>
              </div>

              <div className="d-flex align-items-center mb-3">
                <CheckCircle2 size={16} className="text-success me-2" />
                <small className="text-secondary">Seus dados estão protegidos por criptografia de ponta a ponta.</small>
              </div>

              <button type="submit" className="btn btn-success w-100 fw-bold py-2" disabled={loading}>
                {loading ? 'Processando Pagamento...' : 'Pagar R$ 97,00 e Matricular-se'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
