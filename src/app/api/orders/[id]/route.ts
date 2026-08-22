import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const params = await context.params;
    const id = params.id;
    const body = await request.json();
    const { status } = body;
    
    if (!['En preparación', 'Enviado', 'Entregado'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await db.query(`
      UPDATE orders 
      SET status = $1
      WHERE id = $2
    `, [status, id]);
    
    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const params = await context.params;
    const id = params.id;

    // Soft delete to preserve sales history but consider it cancelled
    await db.query(`UPDATE orders SET archived = true WHERE id = $1`, [id]);
    
    // Restore stock
    const itemsResult = await db.query(`SELECT "productId", quantity FROM order_items WHERE "orderId" = $1`, [id]);
    for (const item of itemsResult.rows) {
      await db.query(`UPDATE products SET stock = stock + $1 WHERE id = $2`, [item.quantity, item.productId]);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
