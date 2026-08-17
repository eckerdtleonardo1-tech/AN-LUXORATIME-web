'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/components/CartProvider';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: '', description: '', price: 0, stock: 0, image: '', category: ''
  });

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !currentProduct.id;
    const url = isNew ? '/api/products' : `/api/products/${currentProduct.id}`;
    const method = isNew ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentProduct)
    });

    if (res.ok) {
      setIsEditing(false);
      setCurrentProduct({ name: '', description: '', price: 0, stock: 0, image: '', category: '' });
      fetchProducts();
    } else {
      alert('Error al guardar el producto');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
    
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchProducts();
    } else {
      alert('Error al eliminar');
    }
  };

  if (isEditing) {
    return (
      <div>
        <h2 style={{ marginBottom: '2rem' }}>{currentProduct.id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        <div className="card" style={{ padding: '2rem', maxWidth: '600px' }}>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input type="text" className="input" required value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea className="input" required value={currentProduct.description} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Precio</label>
                <input type="number" className="input" required value={currentProduct.price} onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Stock</label>
                <input type="number" className="input" required value={currentProduct.stock} onChange={e => setCurrentProduct({...currentProduct, stock: Number(e.target.value)})} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Categoría</label>
              <input type="text" className="input" required value={currentProduct.category} onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">URL de la Imagen</label>
              <input type="url" className="input" required value={currentProduct.image} onChange={e => setCurrentProduct({...currentProduct, image: e.target.value})} />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" className="btn btn-primary">Guardar</button>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <h2>Gestión de Catálogo</h2>
        <button className="btn btn-primary" onClick={() => { setCurrentProduct({ name: '', description: '', price: 0, stock: 0, image: '', category: '' }); setIsEditing(true); }}>
          <Plus size={20} /> Nuevo Producto
        </button>
      </div>

      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td><img src={p.image} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>$ {p.price.toLocaleString('es-AR')}</td>
                <td>{p.stock}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={() => { setCurrentProduct(p); setIsEditing(true); }}>
                      <Edit size={16} />
                    </button>
                    <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => handleDelete(p.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center" style={{ padding: '2rem' }}>No hay productos registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
