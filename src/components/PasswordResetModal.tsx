import React, { useState } from 'react';
import { updatePassword } from '../services/authService';

export default function PasswordResetModal() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    const ok = await updatePassword(newPassword);
    if (!ok) {
      setError('Erro ao redefinir a senha.');
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark text-white border-warning border-opacity-50">
          <div className="modal-header border-warning border-opacity-25 bg-warning bg-opacity-10">
            <h5 className="modal-title fw-bold d-flex align-items-center text-warning">
              <i className="bi bi-lock-fill me-2 fs-5"></i>
              Redefinição de Senha Necessária
            </h5>
          </div>
          <div className="modal-body p-4">
            <p className="text-secondary mb-4">
              Por motivos de segurança, você precisa redefinir sua senha padrão antes de acessar a plataforma.
            </p>

            {error && (
              <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-25 text-danger py-2">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-secondary small">Nova Senha</label>
                <input 
                  type="password" 
                  className="form-control glass-input text-white" 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="form-label text-secondary small">Confirmar Nova Senha</label>
                <input 
                  type="password" 
                  className="form-control glass-input text-white" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required 
                />
              </div>
              
              <button type="submit" className="btn btn-warning w-100 fw-bold">
                Redefinir e Acessar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
