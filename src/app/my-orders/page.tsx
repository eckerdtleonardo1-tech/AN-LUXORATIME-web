'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          // Filter out archived if needed, but users probably want to see their own history,
          // however, our API returns archived for everyone right now. We can filter it here.
          setOrders(data.filter((o: any) => !o.archived));
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div className="container" style={{ padding: '4rem 20px', textAlign: 'center' }}>Cargando pedidos...</div>;
  }

  if (!user) {
    return (
      <div className="container" style={{ padding: '4rem 20px', textAlign: 'center' }}>
        <h2>Debes iniciar sesión</h2>
        <p className="mb-2">Inicia sesión para ver tu historial de pedidos.</p>
        <Link href="/login" className="btn btn-primary">Iniciar Sesión</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 20px', maxWidth: '900px' }}>
      <h1 style={{ textTransform: 'uppercase', marginBottom: '1rem' }}>Mis Pedidos</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Aquí puedes ver el estado actual de todas tus compras. Revisa esta sección periódicamente, ya que el estado se actualizará cuando haya novedades.
      </p>

      {orders.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3>Aún no has realizado ninguna compra</h3>
          <p style={{ margin: '1rem 0 2rem' }}>Explora nuestro catálogo y encuentra tu próximo G-Shock.</p>
          <Link href="/catalog" className="btn btn-primary">Ir al Catálogo</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map(order => (
            <div key={order.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0 }}>Pedido #{order.id}</h3>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    {new Date(order.createdAt).toLocaleDateString('es-AR')}
                  </div>
                </div>
                
                <div style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: '50px', 
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  backgroundColor: 
                    order.status === 'Entregado' ? 'rgba(39, 174, 96, 0.2)' : 
                    order.status === 'Enviado' ? 'rgba(41, 128, 185, 0.2)' : 
                    'rgba(243, 156, 18, 0.2)',
                  color: 
                    order.status === 'Entregado' ? '#2ecc71' : 
                    order.status === 'Enviado' ? '#3498db' : 
                    '#f1c40f',
                  border: '1px solid currentColor'
                }}>
                  {order.status}
                </div>
              </div>

              <div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {order.items.map((item: any, index: number) => (
                    <li key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                      <span>{item.quantity}x {item.productName || 'Producto'}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>$ {Number(item.priceAtTime).toLocaleString('es-AR')}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--surface-border)' }}>
                <span style={{ fontWeight: 'bold' }}>TOTAL</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                  $ {Number(order.totalAmount).toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
