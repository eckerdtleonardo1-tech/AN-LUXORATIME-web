'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Package, ShoppingBag, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, setUser } = useAuth();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
  };

  if (isLoading || !user || user.role !== 'admin') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
        <p>Verificando permisos...</p>
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
