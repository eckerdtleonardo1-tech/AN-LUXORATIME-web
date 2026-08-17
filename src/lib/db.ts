import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const initDb = async () => {
  // Only try to initialize if we have a connection string
  if (!process.env.DATABASE_URL) return;
  
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price NUMERIC NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        image TEXT,
        category VARCHAR(100)
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        "customerName" VARCHAR(255) NOT NULL,
        "customerPhone" VARCHAR(50) NOT NULL,
        "totalAmount" NUMERIC NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'En preparación',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        "orderId" INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        "productId" INTEGER NOT NULL REFERENCES products(id),
        quantity INTEGER NOT NULL,
        "priceAtTime" NUMERIC NOT NULL
      );
    `);
  } catch (err) {
    console.error('Error initializing DB:', err);
  }
};

// Initialize DB schema when module loads (in development)
initDb();

export default {
  query: (text: string, params?: any[]) => pool.query(text, params),
  pool
};
