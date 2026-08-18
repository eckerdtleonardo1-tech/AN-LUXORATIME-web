'use client';

import { useRouter } from 'next/navigation';
import { User, X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.85)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }} onClick={onClose}>
      <div 
        className="card" 
        style={{ 
          maxWidth: '400px', 
          width: '100%', 
          padding: '2.5rem 2rem',
          textAlign: 'center',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', color: 'var(--text-secondary)' }}
        >
          <X size={24} />
        </button>
        
        <div style={{ 
          width: '60px', 
          height: '60px', 
          backgroundColor: 'rgba(255, 62, 62, 0.1)', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          color: 'var(--accent-color)'
        }}>
          <User size={30} />
        </div>
        
        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Inicio de Sesión Requerido</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
          Para poder agregar productos al carrito y realizar una compra, necesitas tener una cuenta en AN LUXORATIME.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem' }}
            onClick={() => {
              onClose();
              router.push('/login');
            }}
          >
            Iniciar Sesión
          </button>
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', padding: '1rem' }}
            onClick={() => {
              onClose();
              router.push('/register');
            }}
          >
            Crear una cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
