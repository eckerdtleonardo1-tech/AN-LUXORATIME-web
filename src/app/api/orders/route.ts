import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    
    // FIX 3: Requerir autenticación para ver pedidos
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    let queryParams: any[] = [];
    let whereClause = '';

    if (session.role !== 'admin') {
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
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Debes iniciar sesión para realizar un pedido' }, { status: 401 });
    }
    const userId = session.id;

    const body = await request.json();
    const { customerName, customerPhone, customerEmail, customerAddress, customerProvince, items } = body;
    
    await client.query('BEGIN');
    
    // Limitador anti-spam (máximo 1 pedido cada 3 minutos por usuario)
    const recentOrders = await client.query(`
      SELECT id FROM orders 
      WHERE "userId" = $1 AND "createdAt" > NOW() - INTERVAL '3 minutes'
    `, [userId]);
    
    if (recentOrders.rows.length > 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Por seguridad anti-spam, debes esperar 3 minutos para hacer otro pedido.' }, { status: 429 });
    }

    // FIX 4 & 5: Calcular precios desde la DB y validar stock
    let totalAmount = 0;
    const validatedItems: { id: number; quantity: number; price: number }[] = [];

    for (const item of items) {
      if (!item.id || !item.quantity || item.quantity <= 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({ error: 'Datos de producto inválidos' }, { status: 400 });
      }

      const productResult = await client.query(
        'SELECT id, price, stock FROM products WHERE id = $1',
        [item.id]
      );

      if (productResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({ error: `Producto #${item.id} no encontrado` }, { status: 400 });
      }

      const product = productResult.rows[0];
      const realPrice = Number(product.price);

      // FIX 5: Validar stock suficiente
      if (product.stock < item.quantity) {
        await client.query('ROLLBACK');
        return NextResponse.json({ error: `Stock insuficiente para el producto #${item.id}. Disponible: ${product.stock}` }, { status: 400 });
      }

      totalAmount += realPrice * item.quantity;
      validatedItems.push({ id: item.id, quantity: item.quantity, price: realPrice });
    }

    const orderResult = await client.query(`
      INSERT INTO orders ("customerName", "customerPhone", "customerEmail", "customerAddress", "customerProvince", "totalAmount", "userId")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [customerName, customerPhone, customerEmail, customerAddress, customerProvince, totalAmount, userId]);
    
    const orderId = orderResult.rows[0].id;
    
    for (const item of validatedItems) {
      await client.query(`
        INSERT INTO order_items ("orderId", "productId", quantity, "priceAtTime")
        VALUES ($1, $2, $3, $4)
      `, [orderId, item.id, item.quantity, item.price]);
      
      // Descontar del stock real (ya validamos que alcanza)
      await client.query(`
        UPDATE products 
        SET stock = stock - $1 
        WHERE id = $2
      `, [item.quantity, item.id]);
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
