'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product, useCart } from '@/components/CartProvider';
import { X } from 'lucide-react';

export default function FeaturedGrid({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  return (
    <>
      <div className="grid-products">
        {products.length > 0 ? products.map((p) => (
          <div key={p.id} className="card product-card">
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
              <Link href="/catalog" className="btn btn-secondary" style={{ width: '100%' }}>Ver más</Link>
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
                onClick={() => {
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
                disabled={selectedProduct.stock <= 0}
              >
                {selectedProduct.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
