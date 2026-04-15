import { SignJWT, jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';

const EXPIRES_IN = '24h';

export interface SessionPayload {
    userId: string;
}

export async function createSession(userId: string): Promise<string> {
    const SECRET = process.env.JWT_SECRET;
    if (!SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const secret = new TextEncoder().encode(SECRET);

    return await new SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(EXPIRES_IN)
        .sign(secret);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
    try {
        console.log('Verifying session with token:', token ? `${token.substring(0, 20)}...` : 'null');

        const SECRET = process.env.JWT_SECRET;
        if (!SECRET) {
            console.error('JWT_SECRET is not defined');
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const secret = new TextEncoder().encode(SECRET);
        const { payload } = await jwtVerify(token, secret);

        console.log('Session verified successfully for userId:', payload.userId);

        return {
            userId: payload.userId as string,
        };
    } catch (error) {
        console.error('Session verification failed:', error);
        return null;
    }
}

export function getRequestSessionToken(request: NextRequest): string | null {
    return request.cookies.get('session')?.value ?? null;
}

export async function getRequestSession(request: NextRequest): Promise<SessionPayload | null> {
    const token = getRequestSessionToken(request);

    if (!token) {
        return null;
    }

    return verifySession(token);
}

export async function getRequestUserId(request: NextRequest): Promise<string | null> {
    const session = await getRequestSession(request);
    return session?.userId ?? null;
}
