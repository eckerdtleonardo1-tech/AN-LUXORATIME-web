'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Package, ShoppingBag, LogOut, LayoutDashboard } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Simple auth for prototype
  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple password
      localStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    router.push('/');
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
        <div className="card" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '2rem' }}>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input 
                type="password" 
                className="input" 
                placeholder="Contraseña" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Ingresar</button>
          </form>
          <Link href="/" style={{ display: 'block', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>Volver a la tienda</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div style={{ padding: '0 1rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--accent-color)' }}>Panel de Control</h2>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>AN LUXORATIME</div>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <Link href="/admin" className={`btn ${pathname === '/admin' ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }}>
            <LayoutDashboard size={20} /> Inicio
          </Link>
          <Link href="/admin/products" className={`btn ${pathname.includes('/products') ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }}>
            <Package size={20} /> Catálogo
          </Link>
          <Link href="/admin/orders" className={`btn ${pathname.includes('/orders') ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }}>
            <ShoppingBag size={20} /> Pedidos
          </Link>
        </nav>

        <button className="btn btn-danger" onClick={handleLogout} style={{ justifyContent: 'flex-start' }}>
          <LogOut size={20} /> Cerrar Sesión
        </button>
      </aside>
      
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
