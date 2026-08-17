'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCart } from './CartProvider';

export type User = {
  name: string;
  email: string;
  role: 'user' | 'admin';
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Note: we can't easily call useCart here if we wrap CartProvider inside AuthProvider or viceversa without causing circular dependency logic if we are not careful.
  // We'll expose a global event or just let CartProvider fetch its own initial state.

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated) {
          setUser({
            name: data.user?.name || 'Admin',
            email: data.user?.email || 'admin@luxoratime.com',
            role: data.role
          });
          // Dispatch a custom event to notify CartProvider to load from DB
          if (data.role === 'user' && data.user?.cart) {
            window.dispatchEvent(new CustomEvent('auth-success', { detail: data.user.cart }));
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
