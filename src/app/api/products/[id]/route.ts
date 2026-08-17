import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const id = params.id;
    const body = await request.json();
    const { name, description, price, stock, image, category } = body;
    
    await db.query(`
      UPDATE products 
      SET name = $1, description = $2, price = $3, stock = $4, image = $5, category = $6
      WHERE id = $7
    `, [name, description, price, stock, image, category, id]);
    
    return NextResponse.json({ id, ...body });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const id = params.id;
    await db.query('DELETE FROM products WHERE id = $1', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
