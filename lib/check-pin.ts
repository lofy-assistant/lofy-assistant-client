import { prisma } from '@/lib/database';
import { hashPhone } from '@/lib/hash-phone';

/**
 * Directly checks whether a user with the given phone number has a PIN set.
 * Use this in server-side code (middleware, server actions, route handlers)
 * instead of making a self-fetch to /api/auth/check-pin, which wastes a
 * network round-trip and double-spends rate-limit tokens.
 */
export async function checkUserHasPin(phone: string): Promise<boolean> {
    try {
        const hashedPhone = await hashPhone(phone);

        const user = await prisma.users.findFirst({
            where: { hashed_phone: hashedPhone },
            select: { pin: true },
        });

        return !!(user?.pin);
    } catch (error) {
        console.error('[check-pin] Failed to check PIN status:', error);
        // Fail safe: if DB is unreachable, treat as no PIN to avoid blocking the flow
        return false;
    }
}
