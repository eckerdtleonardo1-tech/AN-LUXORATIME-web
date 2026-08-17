'use client';

import { useState } from 'react';
import { Product, useCart } from '@/components/CartProvider';

export default function CatalogClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [filter, setFilter] = useState('');
  const { addToCart } = useCart();

  const categories = Array.from(new Set(initialProducts.map(p => p.category).filter(Boolean)));

  const filteredProducts = products.filter(p => {
    if (filter && p.category !== filter) return false;
    return true;
  });

  return (
    <div className="container" style={{ padding: '3rem 20px' }}>
      <h1 style={{ textTransform: 'uppercase', marginBottom: '2rem' }}>Catálogo de Productos</h1>
      
      {categories.length > 0 && (
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn ${filter === '' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('')}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              className={`btn ${filter === cat ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-md)' }}>
          <h3>No hay productos disponibles por el momento.</h3>
        </div>
      ) : (
        <div className="grid-products">
          {filteredProducts.map(product => (
            <div key={product.id} className="card product-card">
              <div className="product-image-container">
                <img src={product.image || 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop'} alt={product.name} />
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <div className="product-price">$ {product.price.toLocaleString('es-AR')}</div>
                <p className="product-desc">{product.description}</p>
                
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                >
                  {product.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
