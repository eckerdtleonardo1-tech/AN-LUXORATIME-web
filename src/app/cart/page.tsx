'use client';

import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import Link from 'next/link';

export default function CartPage() {
  const { items, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });

  const WHATSAPP_NUMBER = '5491112345678'; // Reemplazar por número real

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setIsSubmitting(true);
    try {
      // 1. Guardar orden en la base de datos
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          customerPhone: formData.phone,
          totalAmount: total,
          items: items.map(item => ({ id: item.id, quantity: item.quantity, price: item.price }))
        })
      });

      if (!res.ok) throw new Error('Error al crear orden');
      const data = await res.json();
      const orderId = data.id;

      // 2. Generar mensaje de WhatsApp
      let text = `*NUEVO PEDIDO #${orderId} - AN LUXORATIME*%0A%0A`;
      text += `*Cliente:* ${formData.name}%0A`;
      text += `*Teléfono:* ${formData.phone}%0A%0A`;
      text += `*Detalle:*%0A`;
      
      items.forEach(item => {
        text += `- ${item.quantity}x ${item.name} ($${item.price.toLocaleString('es-AR')})%0A`;
      });
      
      text += `%0A*TOTAL: $${total.toLocaleString('es-AR')}*%0A%0A`;
      text += `Hola! Quiero confirmar mi pedido y coordinar el pago/envío.`;

      // 3. Limpiar carrito y redirigir
      clearCart();
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
      
    } catch (error) {
      alert('Hubo un error al procesar el pedido. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 20px', textAlign: 'center' }}>
        <h2>Tu carrito está vacío</h2>
        <p className="mb-2">Parece que aún no has agregado productos a tu carrito.</p>
        <Link href="/catalog" className="btn btn-primary">Volver al Catálogo</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 20px' }}>
      <h1 style={{ textTransform: 'uppercase', marginBottom: '2rem' }}>Tu Carrito</h1>
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 100%', maxWidth: '100%' }}>
          <div className="card" style={{ padding: '1rem' }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderBottom: '1px solid var(--surface-border)' }}>
                <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                <div style={{ flex: '1' }}>
                  <h4 style={{ marginBottom: '0.25rem' }}>{item.name}</h4>
                  <div style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>$ {item.price.toLocaleString('es-AR')}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => removeFromCart(item.id)}>X</button>
              </div>
            ))}
            
            <div style={{ padding: '1.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Total</h3>
              <h2 style={{ margin: 0, color: 'var(--accent-color)' }}>$ {total.toLocaleString('es-AR')}</h2>
            </div>
          </div>
        </div>

        <div style={{ flex: '1 1 300px', maxWidth: '100%' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Datos de Contacto</h3>
            <form onSubmit={handleCheckout}>
              <div className="form-group">
                <label className="form-label">Nombre y Apellido</label>
                <input 
                  type="text" 
                  className="input" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Teléfono (WhatsApp)</label>
                <input 
                  type="tel" 
                  className="input" 
                  required 
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1rem', backgroundColor: '#25D366' }} // WhatsApp Green
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Procesando...' : 'Comprar por WhatsApp'}
              </button>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '1rem' }}>
                Serás redirigido a WhatsApp para finalizar la compra y coordinar el pago.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
