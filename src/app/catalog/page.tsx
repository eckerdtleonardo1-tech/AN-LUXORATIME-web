import CatalogClient from './CatalogClient';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function CatalogPage() {
  let products = [];
  try {
    const result = await db.query('SELECT * FROM products');
    products = result.rows;
  } catch (e) {
    console.error(e);
  }
  
  return <CatalogClient initialProducts={products as any} />;
}
