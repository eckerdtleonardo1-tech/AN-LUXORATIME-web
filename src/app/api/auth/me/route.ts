import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import db from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false });
    }
    
    if (session.role === 'admin') {
      return NextResponse.json({ authenticated: true, role: 'admin' });
    }

    const result = await db.query('SELECT name, email, cart FROM users WHERE id = $1', [session.id]);
    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({ authenticated: true, user: { name: user.name, email: user.email, cart: user.cart }, role: 'user' });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}

// Route to sync the cart to the database
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'user') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cart } = await request.json();
    await db.query('UPDATE users SET cart = $1 WHERE id = $2', [JSON.stringify(cart), session.id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to sync cart' }, { status: 500 });
  }
}
