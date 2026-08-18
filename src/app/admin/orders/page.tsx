'use client';

import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    const res = await fetch('/api/orders');
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    
    if (res.ok) {
      fetchOrders();
    } else {
      alert('Error al actualizar estado');
    }
  };

  const generatePDF = (order: any) => {
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(22);
      doc.text('AN LUXORATIME', 14, 20);
      doc.setFontSize(12);
      doc.text('Recibo de Compra', 14, 30);
      doc.text(`Pedido #: ${order.id}`, 14, 40);
      doc.text(`Fecha: ${new Date(order.createdAt).toLocaleDateString('es-AR')}`, 14, 48);
      
      // Customer Info
      doc.text(`Cliente: ${order.customerName}`, 14, 60);
      doc.text(`Teléfono: ${order.customerPhone}`, 14, 68);
      
      // Items table
      const tableColumn = ["Producto", "Cantidad", "Precio Unitario", "Subtotal"];
      const tableRows: string[][] = [];

      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          const price = Number(item.priceAtTime);
          const rowData = [
            item.productName || 'Producto',
            item.quantity.toString(),
            `$ ${price.toLocaleString('es-AR')}`,
            `$ ${(price * item.quantity).toLocaleString('es-AR')}`
          ];
          tableRows.push(rowData);
        });
      }

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 80,
        theme: 'grid',
        headStyles: { fillColor: [20, 20, 20] }
      });

      const finalY = (doc as any).lastAutoTable?.finalY || 80;
      
      doc.setFontSize(16);
      doc.text(`TOTAL: $ ${Number(order.totalAmount).toLocaleString('es-AR')}`, 14, finalY + 20);

      doc.setFontSize(10);
      doc.text('Gracias por su compra. Especialistas en Casio G-Shock.', 14, finalY + 40);

      doc.save(`Recibo_Pedido_${order.id}.pdf`);
    } catch (e) {
      console.error('Error generating PDF:', e);
      alert('Error al generar PDF. Verifica la consola.');
    }
  };



  const getStatusClass = (status: string) => {
    switch (status) {
      case 'En preparación': return 'status-prep';
      case 'Enviado': return 'status-sent';
      case 'Entregado': return 'status-done';
      default: return '';
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Gestión de Pedidos</h2>

      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{new Date(order.createdAt).toLocaleDateString('es-AR')}</td>
                <td>
                  <div>{order.customerName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{order.customerPhone}</div>
                </td>
                <td style={{ fontWeight: 'bold' }}>$ {Number(order.totalAmount).toLocaleString('es-AR')}</td>
                <td>
                  <select 
                    className={`status-badge ${getStatusClass(order.status)}`}
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    style={{ background: 'transparent', border: '1px solid currentColor', color: 'inherit', outline: 'none' }}
                  >
                    <option style={{ color: '#000' }} value="En preparación">En preparación</option>
                    <option style={{ color: '#000' }} value="Enviado">Enviado</option>
                    <option style={{ color: '#000' }} value="Entregado">Entregado</option>
                  </select>
                </td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => generatePDF(order)}>
                    <FileText size={16} /> Recibo PDF
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center" style={{ padding: '2rem' }}>No hay pedidos registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
