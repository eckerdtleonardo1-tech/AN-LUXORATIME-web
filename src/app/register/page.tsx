'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setUser({ name, email, role: 'user' });
        router.push('/catalog');
      } else {
        setError(data.error || 'Error al registrarse');
      }
    } catch (err) {
      setError('Hubo un problema de conexión');
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 20px', maxWidth: '400px' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Crear Cuenta</h2>
        
        {error && <div style={{ color: 'var(--accent-color)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input 
              type="text" 
              className="input" 
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="input" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="input" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Registrarse
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>¿Ya tienes cuenta?</p>
          <Link href="/login" style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>Iniciar Sesión</Link>
        </div>
      </div>
    </div>
  );
}
