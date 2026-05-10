import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { Rol } from '../types/index.js';

const SECRET = (import.meta.env.JWT_SECRET ?? process.env.JWT_SECRET) as string | undefined;
if (!SECRET) console.warn('[auth] JWT_SECRET missing — using insecure default');

const SALT_ROUNDS = 10;

export interface SessionPayload {
  id: number;
  rol: Rol;
}

export const hashPassword = (plain: string) => bcrypt.hash(plain, SALT_ROUNDS);
export const comparePassword = (plain: string, hash: string) => bcrypt.compare(plain, hash);

export const signToken = (payload: SessionPayload, expiresIn = '7d'): string =>
  jwt.sign(payload, SECRET ?? 'insecure-dev-secret', { expiresIn } as jwt.SignOptions);

export const verifyToken = (token: string): SessionPayload | null => {
  try {
    const decoded = jwt.verify(token, SECRET ?? 'insecure-dev-secret') as jwt.JwtPayload;
    if (typeof decoded === 'object' && typeof decoded.id === 'number' && (decoded.rol === 'USER' || decoded.rol === 'ADMIN')) {
      return { id: decoded.id, rol: decoded.rol };
    }
    return null;
  } catch {
    return null;
  }
};

export const SESSION_COOKIE = 'sapiens_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
