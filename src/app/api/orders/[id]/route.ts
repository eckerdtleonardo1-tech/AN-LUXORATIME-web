import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
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
    const params = await context.params;
    const id = params.id;

    // Delete order items first due to foreign key constraint
    await db.query(`DELETE FROM order_items WHERE "orderId" = $1`, [id]);
    await db.query(`DELETE FROM orders WHERE id = $1`, [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
