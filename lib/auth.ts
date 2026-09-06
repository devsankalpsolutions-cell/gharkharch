import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'gharkharch_super_secret_saas_jwt_key_2026_x8923!'
);

const SESSION_COOKIE_NAME = 'gharkharch_session';
const TOKEN_EXPIRY = '7d';

export interface UserSessionPayload {
  userId: string;
  email: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: UserSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<UserSessionPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as UserSessionPayload;
  } catch (error) {
    return null;
  }
}

export async function getAuthenticatedUserId(request?: Request): Promise<string> {
  let token: string | undefined;

  // 1. Try to read token from Authorization header if present
  if (request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
  }

  // 2. Try to read token from HTTP-only cookie
  if (!token) {
    try {
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
      if (sessionCookie) {
        token = sessionCookie.value;
      }
    } catch {
      // Fallback for non-RSC contexts
    }
  }

  if (!token) {
    throw new Error('UNAUTHORIZED: Missing session token');
  }

  const payload = await verifySessionToken(token);
  if (!payload || !payload.userId) {
    throw new Error('UNAUTHORIZED: Invalid or expired session token');
  }

  return payload.userId;
}

export function getSessionCookieConfig(token: string) {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  };
}

export function getClearSessionCookieConfig() {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };
}
