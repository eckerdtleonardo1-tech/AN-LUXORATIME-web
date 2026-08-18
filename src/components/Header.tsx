'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';
import { useAuth } from './AuthProvider';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
  const { items } = useCart();
  const { user, setUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlHeader = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          // Scrolling down & past 100px
          setIsVisible(false);
          setMobileMenuOpen(false); // Close menu if scrolling down
        } else {
          // Scrolling up
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', controlHeader);
    return () => window.removeEventListener('scroll', controlHeader);
  }, [lastScrollY]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Don't show public header in admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.dispatchEvent(new CustomEvent('auth-success', { detail: [] })); // Clear cart event
    router.push('/');
  };

  return (
    <header className={`header ${isVisible ? '' : 'header-hidden'}`}>
      <div className="container header-content">
        <Link href="/" className="logo">
          AN <span>LUXORATIME</span>
        </Link>

        {/* Mobile menu button */}
        <button 
          className="mobile-menu-btn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} color="white" /> : <Menu size={24} color="white" />}
        </button>

        <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Inicio</Link>
          <Link href="/catalog" className={`nav-link ${pathname === '/catalog' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Catálogo</Link>
          <Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Contacto</Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Hola, {user.name}</span>
                {user.role === 'admin' && (
                  <Link href="/admin" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setMobileMenuOpen(false)}>
                    Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="nav-link" style={{ fontSize: '0.85rem' }}>Salir</button>
              </div>
            ) : (
              <Link href="/login" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setMobileMenuOpen(false)}>
                <User size={20} /> Ingresar
              </Link>
            )}

            <Link href="/cart" className="nav-link cart-icon" onClick={() => setMobileMenuOpen(false)}>
              <ShoppingCart size={24} />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
