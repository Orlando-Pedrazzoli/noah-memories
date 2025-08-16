// src/lib/auth.ts
// =============================================================================

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabase } from './mongodb';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function authenticateUser(
  username: string,
  password: string
): Promise<string | null> {
  const db = await getDatabase();
  const user = await db.collection('users').findOne({ username });

  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password);
  return isValid ? user._id.toString() : null;
}
