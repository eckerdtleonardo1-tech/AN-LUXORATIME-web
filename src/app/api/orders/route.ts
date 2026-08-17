import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const result = await db.query(`
      SELECT o.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id, 
              'productId', oi."productId", 
              'quantity', oi.quantity, 
              'priceAtTime', oi."priceAtTime",
              'productName', p.name
            )
          ) FILTER (WHERE oi.id IS NOT NULL), '[]'
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi."orderId"
      LEFT JOIN products p ON oi."productId" = p.id
      GROUP BY o.id
      ORDER BY o."createdAt" DESC
    `);
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const client = await db.pool.connect();
  try {
    const body = await request.json();
    const { customerName, customerPhone, totalAmount, items } = body;
    
    await client.query('BEGIN');
    
    const orderResult = await client.query(`
      INSERT INTO orders ("customerName", "customerPhone", "totalAmount")
      VALUES ($1, $2, $3)
      RETURNING id
    `, [customerName, customerPhone, totalAmount]);
    
    const orderId = orderResult.rows[0].id;
    
    for (const item of items) {
      await client.query(`
        INSERT INTO order_items ("orderId", "productId", quantity, "priceAtTime")
        VALUES ($1, $2, $3, $4)
      `, [orderId, item.id, item.quantity, item.price]);
    }
    
    await client.query('COMMIT');
    
    return NextResponse.json({ id: orderId, success: true }, { status: 201 });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  } finally {
    client.release();
  }
}
