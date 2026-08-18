import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // This sets countedInSales to false for all current "Entregado" orders, 
    // effectively resetting the dashboard total to 0, without deleting the actual history.
    await db.query(`
      UPDATE orders 
      SET "countedInSales" = FALSE 
      WHERE status = 'Entregado'
    `);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to reset sales' }, { status: 500 });
  }
}
