import { ReactNode } from 'react';

interface PlaceholderPageProps {
  title: string;
  icon: ReactNode;
  description: string;
}

export default function PlaceholderPage({ title, icon, description }: PlaceholderPageProps) {
  return (
    <div className="container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
      <div className="glass-panel p-5 rounded-4 text-center" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="mb-4 d-flex justify-content-center">
          <div className="bg-dark bg-opacity-50 p-4 rounded-circle border border-secondary border-opacity-25">
            {icon}
          </div>
        </div>
        <h2 className="display-font fw-extrabold text-white mb-3">{title}</h2>
        <p className="text-secondary lead mb-5">{description}</p>
        <button className="btn btn-premium-primary w-100" onClick={() => window.history.back()}>
          Voltar
        </button>
      </div>
    </div>
  );
}
