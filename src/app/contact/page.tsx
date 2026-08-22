'use client';

import { useState } from 'react';
import { Mail, Phone, Clock } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/constants';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

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
    <div className="container" style={{ padding: '4rem 20px', maxWidth: '1000px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>Contacto</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          ¿Tenés alguna duda o consulta? Escribinos y te responderemos a la brevedad.
        </p>
      </div>

      <div className="card" style={{ display: 'flex', flexWrap: 'wrap', overflow: 'hidden', border: '1px solid var(--surface-border)' }}>
        {/* Lado Izquierdo - Info */}
        <div style={{ 
          flex: '1 1 350px', 
          backgroundColor: 'rgba(255,255,255,0.02)', 
          padding: '3rem', 
          borderRight: '1px solid var(--surface-border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h3 style={{ marginBottom: '2rem', color: 'var(--accent-color)', fontSize: '1.4rem' }}>Hablemos</h3>
          
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.8rem', backgroundColor: 'var(--surface-color)', borderRadius: '50%', border: '1px solid var(--surface-border)' }}>
                <Phone size={20} color="var(--accent-color)" />
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '0.2rem' }}>WhatsApp</strong>
                <span style={{ color: 'var(--text-secondary)' }}>33 2953-4029</span>
              </div>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.8rem', backgroundColor: 'var(--surface-color)', borderRadius: '50%', border: '1px solid var(--surface-border)' }}>
                <Mail size={20} color="var(--accent-color)" />
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Email</strong>
                <span style={{ color: 'var(--text-secondary)' }}>contacto@anluxoratime.com</span>
              </div>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.8rem', backgroundColor: 'var(--surface-color)', borderRadius: '50%', border: '1px solid var(--surface-border)' }}>
                <Clock size={20} color="var(--accent-color)" />
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Horario</strong>
                <span style={{ color: 'var(--text-secondary)' }}>Lun a Vie - 10:00 a 18:00hs</span>
              </div>
            </li>
          </ul>
          
          <div>
            <strong style={{ display: 'block', marginBottom: '1rem', color: 'var(--text-primary)' }}>Síguenos en Redes</strong>
            <a href="https://www.instagram.com/an_luxoratime?igsh=MTNqd3ZtcHI3d2hoZQ==" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ display: 'inline-flex', gap: '0.5rem' }}>
              Instagram
            </a>
          </div>
        </div>

        {/* Lado Derecho - Formulario */}
        <div style={{ flex: '1.5 1 400px', padding: '3rem', backgroundColor: 'var(--surface-color)' }}>
          <h3 style={{ marginBottom: '2rem', fontSize: '1.4rem' }}>Envíanos un mensaje</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '1 1 200px' }}>
                <label className="form-label">Nombre</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Tu nombre completo" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                />
              </div>
              <div className="form-group" style={{ flex: '1 1 200px' }}>
                <label className="form-label">Email (opcional)</label>
                <input 
                  type="email" 
                  className="input" 
                  placeholder="tu@email.com" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Mensaje</label>
              <textarea 
                className="input" 
                rows={5} 
                placeholder="¿En qué podemos ayudarte? Escribe tu consulta aquí..."
                required
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>
              Enviar por WhatsApp
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
