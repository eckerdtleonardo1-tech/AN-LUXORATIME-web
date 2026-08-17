import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-an-luxoratime';

export type AuthPayload = {
  id: number;
  email: string;
  role: 'user' | 'admin';
};

export const signToken = (payload: AuthPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): AuthPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch (error) {
    return null;
  }
};

export const getSession = async (): Promise<AuthPayload | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  return verifyToken(token);
};
