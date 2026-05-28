import { HashRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export default function App() {
  // Configuração para deixar o texto mais forte se estiver ativo
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-decoration-none transition-colors ${
      isActive ? 'fw-bold' : 'fw-medium text-secondary hover-white'
    }`;

  // Configuração para aplicar a cor roxa na aba ativa
  const navLinkStyle = ({ isActive }: { isActive: boolean }) => 
    isActive ? { color: '#A855F7' } : {};

  return (
    <HashRouter>
      {/* Container in dark mode with full height */}
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
              <NavLink to="/modulos" className={navLinkClass} style={navLinkStyle}>Módulos</NavLink>
              <NavLink to="/aulas" className={navLinkClass} style={navLinkStyle}>Aulas</NavLink>
              <NavLink to="/utilitarios" className={navLinkClass} style={navLinkStyle}>Utilitários</NavLink>
              <NavLink to="/certificado" className={navLinkClass} style={navLinkStyle}>Certificado</NavLink>
            </nav>
          </div>
        </header>

        {/* Empty Screen */}
        <main className="main-content-scrollable flex-grow-1">
          <Routes>
            <Route path="*" element={<></>} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
