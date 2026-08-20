'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const WHATSAPP_NUMBER = '3329534029';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      alert('Por favor completa tu nombre y mensaje.');
      return;
    }
    
    let text = `*Nueva Consulta - AN LUXORATIME*%0A%0A`;
    text += `*Nombre:* ${formData.name}%0A`;
    if (formData.email) text += `*Email:* ${formData.email}%0A`;
    text += `*Mensaje:*%0A${formData.message}`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  return (
    <div className="container" style={{ padding: '3rem 20px', maxWidth: '800px' }}>
      <h1 style={{ textTransform: 'uppercase', marginBottom: '1rem', textAlign: 'center' }}>Contacto</h1>
      <p style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-secondary)' }}>
        ¿Tenés alguna duda? Escribinos y te responderemos a la brevedad.
      </p>

      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-color)' }}>Información Directa</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li><strong>WhatsApp:</strong> 33 2953-4029</li>
            <li><strong>Email:</strong> contacto@anluxoratime.com</li>
            <li><strong>Horario:</strong> Lun a Vie - 10:00 a 18:00hs</li>
          </ul>
          
          <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--accent-color)' }}>Redes Sociales</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="https://www.instagram.com/an_luxoratime?igsh=MTNqd3ZtcHI3d2hoZQ==" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Instagram</a>
          </div>
        </div>

        <div style={{ flex: '2 1 400px' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Tu nombre" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input 
                  type="email" 
                  className="input" 
                  placeholder="tu@email.com" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mensaje</label>
                <textarea 
                  className="input" 
                  rows={5} 
                  placeholder="Escribe tu consulta aquí..."
                  required
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Enviar Mensaje por WhatsApp</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
