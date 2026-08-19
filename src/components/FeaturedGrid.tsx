'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, useCart } from '@/components/CartProvider';
import { useAuth } from '@/components/AuthProvider';
import { X } from 'lucide-react';

import LoginModal from '@/components/LoginModal';

export default function FeaturedGrid({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (products.length <= 1) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 332, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [products]);

  const handleAddToCart = (product: Product) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    addToCart(product);
    setSelectedProduct(null);
  };

  return (
    <>
      <div ref={scrollRef} className="featured-scroll-container" style={{
        display: 'flex',
        overflowX: 'auto',
        gap: '2rem',
        paddingBottom: '1rem',
        scrollSnapType: 'x mandatory',
        scrollbarWidth: 'thin'
      }}>
        {products.length > 0 ? products.map((p) => (
          <div key={p.id} className="card product-card" style={{
            flex: '0 0 auto',
            width: '300px',
            scrollSnapAlign: 'start'
          }}>
            <div 
              className="product-image-container" 
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedProduct(p)}
            >
              <img src={p.image} alt={p.name} />
            </div>
            <div className="product-info">
              <h3 className="product-title">{p.name}</h3>
              <div className="product-price">$ {Number(p.price).toLocaleString('es-AR')}</div>
              <p className="product-desc" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>
              <Link href="/catalog" className="btn btn-secondary" style={{ width: '100%', marginTop: 'auto' }}>Ver más</Link>
            </div>
          </div>
        )) : (
          <p className="text-center" style={{ gridColumn: '1 / -1' }}>No hay productos destacados por el momento.</p>
        )}
      </div>

      {selectedProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setSelectedProduct(null)}>
          <div 
            className="card" 
            style={{ 
              maxWidth: '900px', 
              width: '100%', 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              display: 'flex', 
              flexDirection: 'row', 
              flexWrap: 'wrap',
              position: 'relative',
              backgroundColor: 'var(--surface-color)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedProduct(null)}
              style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '5px' }}
            >
              <X color="white" size={24} />
            </button>
            <div style={{ flex: '1 1 300px', minHeight: '300px', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
              />
            </div>
            <div style={{ flex: '1 1 300px', padding: '2.5rem' }}>
              <div style={{ textTransform: 'uppercase', color: 'var(--accent-color)', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {selectedProduct.category}
              </div>
              <h2 style={{ marginBottom: '1rem' }}>{selectedProduct.name}</h2>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                $ {Number(selectedProduct.price).toLocaleString('es-AR')}
              </div>
              <div style={{ marginBottom: '2rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                {selectedProduct.description.split('\n').map((line, i) => (
                  <p key={i} style={{ marginBottom: '0.5rem' }}>{line}</p>
                ))}
              </div>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '1rem' }}
                onClick={() => handleAddToCart(selectedProduct)}
                disabled={selectedProduct.stock <= 0}
              >
                {selectedProduct.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
              </button>
            </div>
          </div>
        </div>
      )}

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
}
