import Link from 'next/link';

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1920&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '6rem 0',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ textTransform: 'uppercase', marginBottom: '1rem', color: '#fff' }}>
            Resistencia <span style={{ color: 'var(--accent-color)' }}>Extrema</span>
          </h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem', color: '#ccc' }}>
            Descubre nuestra colección exclusiva de relojes Casio G-Shock. Diseñados para superar cualquier límite con estilo.
          </p>
          <Link href="/catalog" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Explorar Catálogo
          </Link>
        </div>
      </section>

      {/* Featured Section (Static placeholder for concept) */}
      <section className="featured-section" style={{ padding: '5rem 0' }}>
        <div className="container">
          <h2 className="text-center mb-2" style={{ textTransform: 'uppercase' }}>Destacados</h2>
          
          <div className="grid-products">
            {/* Example product 1 */}
            <div className="card product-card">
              <div className="product-image-container">
                <img src="https://images.unsplash.com/photo-1549972574-8e3e1ed6a347?w=500&auto=format&fit=crop" alt="G-Shock Black" />
              </div>
              <div className="product-info">
                <h3 className="product-title">Casio G-Shock DW-5600BB</h3>
                <div className="product-price">$ 140,000</div>
                <p className="product-desc">Un clásico atemporal en un formato All-Black. Resistencia extrema al impacto y resistencia al agua.</p>
                <Link href="/catalog" className="btn btn-secondary" style={{ width: '100%' }}>Ver más</Link>
              </div>
            </div>

            {/* Example product 2 */}
            <div className="card product-card">
              <div className="product-image-container">
                <img src="https://images.unsplash.com/photo-1614164185128-f4cb0ba98d59?w=500&auto=format&fit=crop" alt="G-Shock Mudmaster" />
              </div>
              <div className="product-info">
                <h3 className="product-title">Casio G-Shock Mudmaster</h3>
                <div className="product-price">$ 320,000</div>
                <p className="product-desc">Construido para resistir lodo y vibraciones, con brújula y termómetro. Tu mejor aliado outdoor.</p>
                <Link href="/catalog" className="btn btn-secondary" style={{ width: '100%' }}>Ver más</Link>
              </div>
            </div>

            {/* Example product 3 */}
            <div className="card product-card">
              <div className="product-image-container">
                <img src="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop" alt="G-Shock GA-2100" />
              </div>
              <div className="product-info">
                <h3 className="product-title">Casio G-Shock GA-2100</h3>
                <div className="product-price">$ 180,000</div>
                <p className="product-desc">Conocido como el "CasiOak". Diseño octogonal super delgado y minimalista pero con estructura Carbon Core Guard.</p>
                <Link href="/catalog" className="btn btn-secondary" style={{ width: '100%' }}>Ver más</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section style={{ backgroundColor: 'var(--surface-color)', padding: '4rem 0', borderTop: '1px solid var(--surface-border)' }}>
        <div className="container flex justify-between" style={{ flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ flex: '1 1 250px', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--accent-color)' }}>Envío Seguro</h3>
            <p>Despachamos a todo el país con empaquetado reforzado.</p>
          </div>
          <div style={{ flex: '1 1 250px', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--accent-color)' }}>Garantía Oficial</h3>
            <p>Todos nuestros productos cuentan con 12 meses de garantía.</p>
          </div>
          <div style={{ flex: '1 1 250px', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--accent-color)' }}>Atención Personalizada</h3>
            <p>Tu compra será gestionada directamente por WhatsApp.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
