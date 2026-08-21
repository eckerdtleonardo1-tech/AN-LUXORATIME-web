'use client';

import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="logo">
          AN <span>LUXORATIME</span>
        </div>
        <div style={{ margin: '1rem 0' }}>
          <a href="https://www.instagram.com/an_luxoratime?igsh=MTNqd3ZtcHI3d2hoZQ==" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
            Instagram
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} AN LUXORATIME. Todos los derechos reservados.</p>
        <p>Especialistas en Casio G-Shock</p>
      </div>
    </footer>
  );
}
