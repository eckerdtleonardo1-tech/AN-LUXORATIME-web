import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const result = await db.query(`
      INSERT INTO users (name, email, password, cart)
      VALUES ($1, $2, $3, '[]'::jsonb)
      RETURNING id, email
    `, [name, email, hashedPassword]);

    const user = result.rows[0];
    const token = signToken({ id: user.id, email: user.email, role: 'user' });
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });

    return NextResponse.json({ success: true, role: 'user' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
