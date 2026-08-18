import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    // If regular user, only fetch their orders. Admin can fetch all orders.
    // Wait, AdminOrders component fetches /api/orders without extra params. 
    // We should differentiate. If user role is user, add WHERE userId = $1.
    // For now, let's keep GET simple: if user is not admin, filter by userId.
    let queryParams: any[] = [];
    let whereClause = '';

    if (session && session.role !== 'admin') {
      whereClause = 'WHERE o."userId" = $1';
      queryParams.push(session.id);
    }

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
      ${whereClause}
      GROUP BY o.id
      ORDER BY o."createdAt" DESC
    `, queryParams);
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const client = await db.pool.connect();
  try {
    const session = await getSession();
    const userId = session?.id || null;

    const body = await request.json();
    const { customerName, customerPhone, customerEmail, customerAddress, customerProvince, totalAmount, items } = body;
    
    await client.query('BEGIN');
    
    const orderResult = await client.query(`
      INSERT INTO orders ("customerName", "customerPhone", "customerEmail", "customerAddress", "customerProvince", "totalAmount", "userId")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [customerName, customerPhone, customerEmail, customerAddress, customerProvince, totalAmount, userId]);
    
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
