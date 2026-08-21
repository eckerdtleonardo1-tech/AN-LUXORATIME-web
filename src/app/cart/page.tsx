'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/components/CartProvider';
import Link from 'next/link';

export default function CartPage() {
  const { items, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    address: '', 
    city: '',
    province: '',
    zip: ''
  });

  const WHATSAPP_NUMBER = '3329534029';
  const [provinces, setProvinces] = useState<{id: string, nombre: string}[]>([]);
  const [cities, setCities] = useState<{id: string, nombre: string}[]>([]);

  useEffect(() => {
    fetch('https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre&orden=nombre')
      .then(res => res.json())
      .then(data => {
        if (data && data.provincias) setProvinces(data.provincias);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (formData.province) {
      // Find the province ID for the API
      const prov = provinces.find(p => p.nombre === formData.province);
      if (prov) {
        fetch(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${prov.id}&campos=id,nombre&max=1000&orden=nombre`)
          .then(res => res.json())
          .then(data => {
            if (data && data.localidades) {
              // Filtrar repetidos por nombre para que quede más limpio
              const unicas = Array.from(new Map(data.localidades.map((l: any) => [l.nombre, l])).values());
              setCities(unicas as any);
            }
          })
          .catch(console.error);
      }
    } else {
      setCities([]);
    }
  }, [formData.province, provinces]);

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
          customerEmail: formData.email,
          customerAddress: `${formData.address}, ${formData.city}, ${formData.province} (${formData.zip})`,
          customerProvince: formData.province,
          totalAmount: total,
          items: items.map(item => ({ id: item.id, quantity: item.quantity, price: item.price }))
        })
      });

      if (!res.ok) throw new Error('Error al crear orden');
      const data = await res.json();
      const orderId = data.id;

      // 2. Generar mensaje de WhatsApp
      let text = `*🛍️ NUEVO PEDIDO #${orderId} - AN LUXORATIME*%0A%0A`;
      
      text += `*👤 Datos del Cliente:*%0A`;
      text += `• *Nombre:* ${formData.name}%0A`;
      text += `• *WhatsApp:* ${formData.phone}%0A`;
      if (formData.email) text += `• *Email:* ${formData.email}%0A%0A`;
      
      text += `*🚚 Datos de Envío:*%0A`;
      text += `• *Dirección:* ${formData.address}%0A`;
      text += `• *Ciudad:* ${formData.city}%0A`;
      text += `• *Provincia:* ${formData.province}%0A`;
      text += `• *Código Postal:* ${formData.zip}%0A%0A`;
      
      text += `*📦 Detalle del Pedido:*%0A`;
      items.forEach(item => {
        text += `- ${item.quantity}x ${item.name} ($${item.price.toLocaleString('es-AR')})%0A`;
      });
      
      text += `%0A*💰 TOTAL: $${total.toLocaleString('es-AR')}*%0A%0A`;
      text += `¡Hola! Quiero confirmar mi pedido y coordinar el pago/envío.`;

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
        <div style={{ flex: '1.5 1 400px', maxWidth: '100%' }}>
          <div className="card" style={{ padding: '1rem' }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderBottom: '1px solid var(--surface-border)', flexWrap: 'wrap' }}>
                <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                <div style={{ flex: '1 1 150px' }}>
                  <h4 style={{ marginBottom: '0.25rem' }}>{item.name}</h4>
                  <div style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>$ {item.price.toLocaleString('es-AR')}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '0 0 auto' }}>
                  <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <button className="btn btn-danger" style={{ padding: '0.5rem', marginLeft: 'auto' }} onClick={() => removeFromCart(item.id)}>X</button>
              </div>
            ))}
            
            <div style={{ padding: '1.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ margin: 0 }}>Total Estimado</h3>
              <h2 style={{ margin: 0, color: 'var(--accent-color)', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>$ {total.toLocaleString('es-AR')}</h2>
            </div>
          </div>
        </div>

        <div style={{ flex: '1 1 350px', maxWidth: '100%' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-color)' }}>Datos de Envío</h3>
            <form onSubmit={handleCheckout}>
              <div className="form-group">
                <label className="form-label">Nombre y Apellido *</label>
                <input 
                  type="text" 
                  className="input" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">WhatsApp *</label>
                <input 
                  type="tel" 
                  className="input" 
                  required 
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email (opcional)</label>
                <input 
                  type="email" 
                  className="input" 
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <h4 style={{ margin: '1.5rem 0 1rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem' }}>Domicilio de Entrega</h4>

              <div className="form-group">
                <label className="form-label">Dirección *</label>
                <input 
                  type="text" 
                  className="input" 
                  required 
                  placeholder="Calle, Número, Piso/Depto"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Provincia *</label>
                <select 
                  className="input" 
                  required 
                  value={formData.province}
                  onChange={e => setFormData({ ...formData, province: e.target.value, city: '' })}
                >
                  <option value="">Selecciona una provincia</option>
                  {provinces.map(prov => (
                    <option key={prov.id} value={prov.nombre}>{prov.nombre}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: '2 1 150px' }}>
                  <label className="form-label">Ciudad / Localidad *</label>
                  {cities.length > 0 ? (
                    <select 
                      className="input" 
                      required 
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                    >
                      <option value="">Selecciona una ciudad</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.nombre}>{city.nombre}</option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      type="text" 
                      className="input" 
                      required 
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      placeholder={formData.province ? "Cargando..." : "Primero selecciona provincia"}
                      disabled={!formData.province}
                    />
                  )}
                </div>
                <div className="form-group" style={{ flex: '1 1 80px' }}>
                  <label className="form-label">C.P. *</label>
                  <input 
                    type="text" 
                    className="input" 
                    required 
                    value={formData.zip}
                    onChange={e => setFormData({ ...formData, zip: e.target.value })}
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1rem', backgroundColor: '#25D366', color: 'white', fontWeight: 'bold' }} 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Procesando...' : 'Comprar por WhatsApp'}
              </button>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '1rem' }}>
                Serás redirigido a WhatsApp para enviar todos tus datos de forma segura y coordinar el pago.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
