import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const { login, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    login(loginEmail, loginPassword);
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !registerPassword) return;
    register(name, email, registerPassword, role);
    onClose();
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 1050 }}>
      <div className="w-100" style={{ maxWidth: '500px', padding: '20px' }}>
        <div className="modal-content border border-secondary border-opacity-50 rounded-4 overflow-hidden" style={{ backgroundColor: '#0B0F19' }}>
          <div className="modal-header border-bottom border-secondary border-opacity-50">
            <h5 className="modal-title display-font fw-bold text-white">
              {isRegistering ? 'Criar Conta' : 'Acessar Plataforma'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          
          <div className="modal-body p-4">
            {!isRegistering ? (
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label text-secondary small text-uppercase tracking-wider">E-mail</label>
                  <input 
                    type="email"
                    className="form-control border-secondary text-white" 
                    style={{ backgroundColor: '#141B2D' }}
                    value={loginEmail} 
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="Digite seu e-mail"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label text-secondary small text-uppercase tracking-wider">Senha</label>
                  <input 
                    type="password"
                    className="form-control border-secondary text-white" 
                    style={{ backgroundColor: '#141B2D' }}
                    value={loginPassword} 
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Sua senha"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-premium-primary w-100 d-flex align-items-center justify-content-center gap-2">
                  <LogIn size={18} /> Entrar
                </button>
                <div className="text-center mt-3">
                  <button type="button" className="btn btn-link text-info text-decoration-none small p-0" onClick={() => setIsRegistering(true)}>
                    Não tem conta? Crie uma aqui
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label text-secondary small">Nome Completo</label>
                  <input 
                    type="text" 
                    className="form-control border-secondary text-white" 
                    style={{ backgroundColor: '#141B2D' }}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-secondary small">E-mail</label>
                  <input 
                    type="email" 
                    className="form-control border-secondary text-white" 
                    style={{ backgroundColor: '#141B2D' }}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-secondary small">Senha</label>
                  <input 
                    type="password" 
                    className="form-control border-secondary text-white" 
                    style={{ backgroundColor: '#141B2D' }}
                    value={registerPassword}
                    onChange={e => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label text-secondary small">Tipo de Conta</label>
                  <select 
                    className="form-select border-secondary text-white"
                    style={{ backgroundColor: '#141B2D' }}
                    value={role}
                    onChange={e => setRole(e.target.value as 'student' | 'admin')}
                  >
                    <option value="student">Aluno</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-premium-primary w-100 d-flex align-items-center justify-content-center gap-2">
                  <UserPlus size={18} /> Cadastrar
                </button>
                <div className="text-center mt-3">
                  <button type="button" className="btn btn-link text-info text-decoration-none small p-0" onClick={() => setIsRegistering(false)}>
                    Já tem conta? Entre aqui
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
