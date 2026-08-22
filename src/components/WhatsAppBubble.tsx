'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppBubble() {
  const WHATSAPP_NUMBER = '3329534029';
  const message = '¡Hola! Quisiera hacer una consulta.';

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        backgroundColor: '#25D366',
        color: 'white',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        zIndex: 9998,
        transition: 'transform 0.3s ease',
      }}
      className="whatsapp-bubble"
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <MessageCircle size={32} />
    </a>
  );
}
