import React, { useState, useEffect, ReactNode } from 'react';
import { HashRouter, Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';

import Home from '../pages/Home';
import CourseDetail from '../pages/CourseDetail';
import MyCourses from '../pages/MyCourses';
import CoursePlayer from '../pages/CoursePlayer';
import Paths from '../pages/Paths';
import Certificates from '../pages/Certificates';
import AdminDashboard from '../pages/AdminDashboard';
import LoginModal from '../components/LoginModal';
import PasswordResetModal from '../components/PasswordResetModal';

import { getSession, logout } from '../services/authService';
import { User } from '../types';

// Protected Route wrapper
function ProtectedRoute({ children, adminOnly = false }: { children: ReactNode, adminOnly?: boolean }) {
  const user = getSession();
  const isAdmin = user?.role === 'admin';
  if (!user) return <Navigate to="/" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppLayout() {
  const [user, setUser] = useState<User | null>(getSession());
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const handleSessionChange = () => {
      setUser(getSession());
    };
    window.addEventListener('session_change', handleSessionChange);
    return () => window.removeEventListener('session_change', handleSessionChange);
  }, []);

  const isAdmin = user?.role === 'admin';

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-decoration-none transition-colors ${
      isActive ? 'fw-bold' : 'fw-medium text-secondary hover-white'
    }`;

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => 
    isActive ? { color: '#A855F7' } : {};

  return (
    <div className="full-page-container bg-dark text-white" style={{ minHeight: '100vh' }}>
      <header className="glass-nav py-3 px-4 sticky-top z-3">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none text-white">
            <div 
              className="d-flex align-items-center justify-content-center rounded-3 text-white"
              style={{ 
                width: '40px', 
                height: '40px', 
                background: 'var(--primary-gradient)',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
              }}
            >
              <i className="bi bi-mortarboard-fill fs-5"></i>
            </div>
            <span className="fs-4 display-font fw-extrabold tracking-tight mb-0">
              Saddi <span style={{ color: '#A855F7' }}>estudos</span>
            </span>
          </Link>

          <nav className="d-flex align-items-center gap-4">
            <NavLink to="/trilhas" className={navLinkClass} style={navLinkStyle}>Trilhas</NavLink>
            <NavLink to="/cursos" className={navLinkClass} style={navLinkStyle}>Cursos</NavLink>
            {user && (
              <>
                <NavLink to="/aulas" className={navLinkClass} style={navLinkStyle}>Aulas</NavLink>
                <NavLink to="/certificado" className={navLinkClass} style={navLinkStyle}>Certificados</NavLink>
              </>
            )}
            {isAdmin && (
              <NavLink to="/admin" className={navLinkClass} style={navLinkStyle}>Admin</NavLink>
            )}
          </nav>

          <div>
            {user ? (
              <div className="d-flex align-items-center gap-3">
                <span className="small text-secondary d-none d-md-inline-block">
                  Olá, <strong className="text-white">{user.name}</strong>
                  {isAdmin && <i className="bi bi-shield-fill-check text-primary ms-1"></i>}
                </span>
                <button onClick={logout} className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1">
                  <i className="bi bi-box-arrow-right"></i> Sair
                </button>
              </div>
            ) : (
              <button onClick={() => setShowLoginModal(true)} className="btn btn-premium-primary btn-sm d-flex align-items-center gap-2">
                <i className="bi bi-box-arrow-in-right"></i> Entrar
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="main-content-scrollable flex-grow-1">
        <Routes>
          <Route path="/" element={<Navigate to="/cursos" replace />} />
          <Route path="/trilhas" element={<Paths />} />
          <Route path="/cursos" element={<Home />} />
          <Route path="/curso/:id" element={<CourseDetail />} />
          <Route path="/aulas" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
          <Route path="/aulas/:id" element={<ProtectedRoute><CoursePlayer /></ProtectedRoute>} />
          <Route path="/certificado" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/cursos" replace />} />
        </Routes>
      </main>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      {user?.needsPasswordReset && <PasswordResetModal />}
    </div>
  );
}

import { ToastProvider } from '../contexts/ToastContext';

export const AppRoutes: React.FC = () => {
  return (
    <HashRouter>
      <ToastProvider>
        <AppLayout />
      </ToastProvider>
    </HashRouter>
  );
};
