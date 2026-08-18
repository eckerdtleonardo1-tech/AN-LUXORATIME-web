'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [sales, setSales] = useState(0);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        let totalSales = 0;
        let totalPending = 0;

        data.forEach((order: any) => {
          const orderDate = new Date(order.createdAt);
          if (order.status === 'Entregado') {
            if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
              if (order.countedInSales !== false) {
                totalSales += Number(order.totalAmount);
              }
            }
          } else if (!order.archived) {
            totalPending += 1;
          }
        });

        setSales(totalSales);
        setPending(totalPending);
      }
    };
    fetchOrders();
  }, []);

  const handleResetSales = async () => {
    if (!confirm('¿Seguro que deseas reiniciar las ventas del mes a $0? Esto marcará todos los pedidos entregados de este mes como ya contados, ocultándolos del total, pero seguirán existiendo en la base de datos.')) return;
    
    const res = await fetch('/api/orders/reset', { method: 'POST' });
    if (res.ok) {
      setSales(0);
    } else {
      alert('Error al reiniciar las ventas');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Resumen del Negocio</h1>
        <button className="btn btn-secondary" onClick={handleResetSales}>
          Reiniciar Ventas del Mes
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Ventas del mes</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-color)', margin: '1rem 0' }}>
            $ {sales.toLocaleString('es-AR')}
          </p>
          <p style={{ fontSize: '0.9rem' }}>Pedidos entregados este mes</p>
        </div>
        
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Pedidos Pendientes</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-color)', margin: '1rem 0' }}>
            {pending}
          </p>
          <p style={{ fontSize: '0.9rem' }}>En preparación o enviados</p>
        </div>
      </div>
    </div>
  );
}
