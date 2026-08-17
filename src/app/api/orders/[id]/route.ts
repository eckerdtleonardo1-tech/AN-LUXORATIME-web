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
