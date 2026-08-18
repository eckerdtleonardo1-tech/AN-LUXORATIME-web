import Link from 'next/link';
import db from '@/lib/db';
import FeaturedGrid from '@/components/FeaturedGrid';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let featuredProducts = [];
  try {
    const result = await db.query('SELECT * FROM products WHERE featured = true LIMIT 6');
    featuredProducts = result.rows;
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://watchello.es/cdn/shop/collections/gshock-casioak-resin.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        padding: '6rem 0',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        width: '100%'
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

      {/* Featured Section */}
      <section className="featured-section" style={{ padding: '5rem 0' }}>
        <div className="container">
          <h2 className="text-center mb-2" style={{ textTransform: 'uppercase' }}>Destacados</h2>
          
          <FeaturedGrid products={featuredProducts as any[]} />
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
