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
        <p>&copy; {new Date().getFullYear()} AN LUXORATIME. Todos los derechos reservados.</p>
        <p>Especialistas en Casio G-Shock</p>
      </div>
    </footer>
  );
}
