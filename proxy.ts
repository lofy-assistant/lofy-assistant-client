import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/session';
import { rateLimiter, authRateLimiter, checkRateLimit } from '@/lib/rate-limit';
import { checkUserHasPin } from '@/lib/check-pin';

const COOKIE_NAME = 'session';

// Routes that don't require authentication
const PUBLIC_ROUTES = [
    '/',
    '/login',
    '/register',
    '/pricing',
    '/features',
    '/about-us',
    '/guides',
    '/privacy-policy',
    '/terms',
    '/api/auth/login',
    '/api/auth/logout',
    '/api/auth/register',
    '/api/auth/check-pin',
    '/api/stripe',   // checkout, webhooks – supports guest checkout
    '/api/geo',     // pricing geo detection
];

// Static file extensions to allow through
const STATIC_EXTENSIONS = ['.ico', '.png', '.jpg', '.jpeg', '.svg', '.css', '.js', '.woff', '.woff2', '.ttf'];

/**
 * Applies security headers to any NextResponse
 */
function applySecurityHeaders(response: NextResponse): NextResponse {
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    response.headers.set('X-DNS-Prefetch-Control', 'off');

    // HSTS: enforce HTTPS for 1 year in production
    if (process.env.NODE_ENV === 'production') {
        response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    // Content-Security-Policy
    // - script-src: 'self' + Stripe (payment widget) + 'unsafe-inline'/'unsafe-eval' for Next.js hydration
    // - style-src: 'self' + 'unsafe-inline' for Tailwind utility classes
    // - img-src: 'self' + data URIs + blob (canvas/avatars) + Stripe
    // - connect-src: 'self' + Stripe API
    // - frame-src: Stripe embedded iframes
    // - font-src: 'self' + data URIs
    // - form-action 'self': prevents form hijacking to external origins
    // - base-uri 'self': prevents <base> tag injection
    // - frame-ancestors 'none': duplicates X-Frame-Options for CSP-aware browsers
    const csp = [
        `default-src 'self'`,
        `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com`,
        `style-src 'self' 'unsafe-inline'`,
        `img-src 'self' data: blob: https://*.stripe.com`,
        `font-src 'self' data:`,
        `connect-src 'self' https://api.stripe.com`,
        `frame-src https://js.stripe.com https://hooks.stripe.com`,
        `form-action 'self'`,
        `base-uri 'self'`,
        `frame-ancestors 'none'`,
    ].join('; ');
    response.headers.set('Content-Security-Policy', csp);

    return response;
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Allow Next.js internals and static files (No security headers needed for static assets usually, but Next handles them)
    if (
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/favicon') ||
        STATIC_EXTENSIONS.some((ext) => pathname.endsWith(ext))
    ) {
        return NextResponse.next();
    }

    // 2. Apply rate limiting — derive identifier from IP
    // Falls back to a pathname-scoped key so bots without a forwarded IP
    // don't collapse all traffic into one shared 'anonymous' bucket.
    const rawIp =
        request.headers.get('x-real-ip') ||
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const ip = rawIp ?? `anonymous:${pathname}`;

    // Stricter rate limit for auth-related routes
    const isAuthRoute =
        pathname.startsWith('/api/auth/') ||
        pathname === '/login' ||
        pathname === '/register' ||
        pathname === '/forgot-pin' ||
        pathname === '/reset-pin';

    const limiter = isAuthRoute ? authRateLimiter : rateLimiter;
    const rlResult = await checkRateLimit(limiter, ip);

    if (rlResult.limited) {
        // Guard against negative values from clock skew
        // `rlResult.reset` may be in seconds or milliseconds depending on the
        // upstream implementation. Normalize to milliseconds here.
        let resetMs = rlResult.reset;
        if (typeof resetMs === 'number' && resetMs > 0 && resetMs < 1e12) {
            // values < 1e12 are likely seconds (Unix epoch), convert to ms
            resetMs = resetMs * 1000;
        }
        const retryAfterSeconds = Math.max(0, Math.ceil((resetMs - Date.now()) / 1000));
        const response = new NextResponse('Too Many Requests', { status: 429 });
        response.headers.set('Retry-After', String(retryAfterSeconds));
        response.headers.set('X-RateLimit-Limit', String(rlResult.limit));
        response.headers.set('X-RateLimit-Remaining', '0');
        // Expose reset as unix seconds for clients (standard practice)
        const resetSeconds = Math.floor((typeof resetMs === 'number' ? resetMs : Date.now()) / 1000);
        response.headers.set('X-RateLimit-Reset', String(resetSeconds));
        return applySecurityHeaders(response);
    }

    // 3. Check if route is public
    // Use exact match for static pages, and startsWith only for API endpoints or defined prefixes
    const isPublicRoute = PUBLIC_ROUTES.some((route) => {
        if (route.startsWith('/api/')) {
            return pathname.startsWith(route);
        }
        return pathname === route;
    });

    if (isPublicRoute) {
        // If authenticated user tries to access login or register, redirect to dashboard
        if (pathname === '/login' || pathname === '/register') {
            const token = request.cookies.get(COOKIE_NAME)?.value;
            if (token && await verifySession(token)) {
                return applySecurityHeaders(NextResponse.redirect(new URL('/dashboard', request.url)));
            }
        }
        return applySecurityHeaders(NextResponse.next());
    }

    // 4. All other routes require authentication
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
        // Handle specialized onboarding flow if phone query param is present
        const phone = request.nextUrl.searchParams.get('phone');
        const targetPath = pathname + request.nextUrl.search;

        if (phone) {
            try {
                // Call DB directly — avoids a self-fetch back through middleware
                // which would double-spend a rate-limit token and add latency.
                const hasPin = await checkUserHasPin(phone);
                const redirectPath = hasPin ? '/login' : '/register';
                const redirectUrl = new URL(redirectPath, request.url);

                redirectUrl.searchParams.set('redirect', targetPath);
                redirectUrl.searchParams.set('phone', phone);
                return applySecurityHeaders(NextResponse.redirect(redirectUrl));
            } catch (error) {
                console.error('Error checking PIN status in middleware:', error);
                // Fall through to default login redirect on error
            }
        }

        // Default: Redirect to login
        const redirectUrl = new URL('/login', request.url);
        redirectUrl.searchParams.set('redirect', targetPath);
        return applySecurityHeaders(NextResponse.redirect(redirectUrl));
    }

    // 5. Verify the Token
    const session = await verifySession(token);

    if (!session) {
        // Invalid or expired token - clear cookie and redirect to login
        const targetPath = pathname + request.nextUrl.search;
        const redirectUrl = new URL('/login', request.url);
        redirectUrl.searchParams.set('redirect', targetPath);
        
        const response = NextResponse.redirect(redirectUrl);
        response.cookies.set({
            name: COOKIE_NAME,
            value: '',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0,
        });
        return applySecurityHeaders(response);
    }

    // 6. Authenticated Request - Add headers and return
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', session.userId);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    // Forward rate-limit quota to clients so they can self-throttle.
    // Skip when limit === 0, which means Redis was down and we failed open.
    if (!rlResult.limited && rlResult.limit > 0) {
        response.headers.set('X-RateLimit-Limit', String(rlResult.limit));
        response.headers.set('X-RateLimit-Remaining', String(rlResult.remaining));
        // Normalize reset to seconds for consistency with the 429 case above.
        let resetMs = rlResult.reset;
        if (typeof resetMs === 'number' && resetMs > 0 && resetMs < 1e12) {
            resetMs = resetMs * 1000;
        }
        const resetSeconds = Math.floor((typeof resetMs === 'number' ? resetMs : Date.now()) / 1000);
        response.headers.set('X-RateLimit-Reset', String(resetSeconds));
    }

    return applySecurityHeaders(response);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, robots.txt, etc.
         */
        '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
    ],
};


