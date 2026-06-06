import { useState } from 'react';
import { HashRouter, Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Play, Settings, Award, LogIn, LogOut, ShieldCheck } from 'lucide-react';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

import Home from './pages/Home';
import CourseDetail from './pages/CourseDetail';
import MyCourses from './pages/MyCourses';
import CoursePlayer from './pages/CoursePlayer';
import Paths from './pages/Paths';
import Certificates from './pages/Certificates';
import AdminDashboard from './pages/AdminDashboard';
import PlaceholderPage from './pages/PlaceholderPage';
import LoginModal from './components/LoginModal';

import PasswordResetModal from './components/PasswordResetModal';
import { ReactNode } from 'react';

// Protected Route wrapper
function ProtectedRoute({ children, adminOnly = false }: { children: ReactNode, adminOnly?: boolean }) {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppContent() {
  const { user, isAdmin, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Configuração para deixar o texto mais forte se estiver ativo
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-decoration-none transition-colors ${
      isActive ? 'fw-bold' : 'fw-medium text-secondary hover-white'
    }`;

  // Configuração para aplicar a cor roxa na aba ativa
  const navLinkStyle = ({ isActive }: { isActive: boolean }) => 
    isActive ? { color: '#A855F7' } : {};

  return (
    <div className="full-page-container bg-dark text-white" style={{ minHeight: '100vh' }}>
      
      {/* Superior Navigation Bar only */}
      <header className="glass-nav py-3 px-4 sticky-top z-3">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          {/* Logo */}
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
              <GraduationCap size={24} />
            </div>
            <span className="fs-4 display-font fw-extrabold tracking-tight mb-0">
              Saddi <span style={{ color: '#A855F7' }}>estudos</span>
            </span>
          </Link>

          {/* Navigation Options */}
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

          {/* Auth Controls */}
          <div>
            {user ? (
              <div className="d-flex align-items-center gap-3">
                <span className="small text-secondary d-none d-md-inline-block">
                  Olá, <strong className="text-white">{user.name}</strong>
                  {isAdmin && <ShieldCheck size={14} className="text-primary ms-1" />}
                </span>
                <button onClick={logout} className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1">
                  <LogOut size={16} /> Sair
                </button>
              </div>
            ) : (
              <button onClick={() => setShowLoginModal(true)} className="btn btn-premium-primary btn-sm d-flex align-items-center gap-2">
                <LogIn size={16} /> Entrar
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content Area */}
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

export default function App() {
  return (
    <HashRouter>
      <DataProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </DataProvider>
    </HashRouter>
  );
}
