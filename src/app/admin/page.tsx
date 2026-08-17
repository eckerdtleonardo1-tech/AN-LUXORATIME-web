'use client';

export default function AdminDashboard() {
  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Resumen del Negocio</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Ventas del mes</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-color)', margin: '1rem 0' }}>--</p>
          <p style={{ fontSize: '0.9rem' }}>Se calculan externamente</p>
        </div>
        
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Pedidos Pendientes</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-color)', margin: '1rem 0' }}>Gestión</p>
          <p style={{ fontSize: '0.9rem' }}>Revisar sección Pedidos</p>
        </div>
      </div>
    </div>
  );
}
