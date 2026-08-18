import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let result;
    if (category) {
      result = await db.query('SELECT * FROM products WHERE category = $1', [category]);
    } else {
      result = await db.query('SELECT * FROM products');
    }
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, stock, image, category, featured } = body;
    
    const result = await db.query(`
      INSERT INTO products (name, description, price, stock, image, category, featured)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [name, description, price, stock, image, category, featured || false]);
    
    return NextResponse.json({ id: result.rows[0].id, ...body }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
