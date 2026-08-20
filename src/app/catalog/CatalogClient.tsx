'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, useCart } from '@/components/CartProvider';
import { useAuth } from '@/components/AuthProvider';
import { X } from 'lucide-react';

import LoginModal from '@/components/LoginModal';

const ZoomableImage = ({ src, alt }: { src: string, alt: string }) => {
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div 
      style={{ flex: '1 1 300px', minHeight: '300px', backgroundColor: '#000', overflow: 'hidden', position: 'relative', cursor: isZooming ? 'zoom-out' : 'zoom-in' }}
      onMouseEnter={() => setIsZooming(true)}
      onMouseLeave={() => setIsZooming(false)}
      onMouseMove={handleMouseMove}
    >
      <img 
        src={src} 
        alt={alt} 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain',
          transform: isZooming ? 'scale(2.5)' : 'scale(1)',
          transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
          transition: 'transform 0.1s ease-out'
        }} 
      />
    </div>
  );
};

export default function CatalogClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [filter, setFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleAddToCart = (product: Product) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    addToCart(product);
    setSelectedProduct(null);
  };

  const categories = Array.from(new Set(initialProducts.map(p => p.category).filter(Boolean)));

  const filteredProducts = products.filter(p => {
    if (filter && p.category !== filter) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="container" style={{ padding: '3rem 20px' }}>
      <h1 style={{ textTransform: 'uppercase', marginBottom: '2rem' }}>Catálogo de Productos</h1>
      <div style={{ marginBottom: '1.5rem', display: 'flex' }}>
        <input 
          type="text" 
          placeholder="Buscar producto por nombre..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input"
          style={{ width: '100%', maxWidth: '500px' }}
        />
      </div>
      
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
              <div 
                className="product-image-container" 
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedProduct(product)}
              >
                <img src={product.image || 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop'} alt={product.name} />
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <div className="product-price">$ {product.price.toLocaleString('es-AR')}</div>
                <p className="product-desc" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</p>
                
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', marginTop: 'auto' }}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                >
                  {product.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
            <ZoomableImage src={selectedProduct.image} alt={selectedProduct.name} />
            <div style={{ flex: '1 1 300px', padding: '2.5rem' }}>
              <div style={{ textTransform: 'uppercase', color: 'var(--accent-color)', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {selectedProduct.category}
              </div>
              <h2 style={{ marginBottom: '1rem' }}>{selectedProduct.name}</h2>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                $ {selectedProduct.price.toLocaleString('es-AR')}
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
    </div>
  );
}
