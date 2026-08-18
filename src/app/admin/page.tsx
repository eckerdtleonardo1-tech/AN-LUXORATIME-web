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
              totalSales += Number(order.totalAmount);
            }
          } else {
            totalPending += 1;
          }
        });

        setSales(totalSales);
        setPending(totalPending);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Resumen del Negocio</h1>
      
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
