'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';
import { ShoppingCart } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { items } = useCart();
  const pathname = usePathname();
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Don't show public header in admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="header">
      <div className="container header-content">
        <Link href="/" className="logo">
          AN <span>LUXORATIME</span>
        </Link>
        <nav className="nav-links">
          <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Inicio</Link>
          <Link href="/catalog" className={`nav-link ${pathname === '/catalog' ? 'active' : ''}`}>Catálogo</Link>
          <Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}>Contacto</Link>
          <Link href="/cart" className="nav-link cart-icon">
            <ShoppingCart size={24} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
