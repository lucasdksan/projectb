import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const publicRoutes = [
    { path: "/auth/signin", whenAuthenticated: "redirect" },
    { path: "/auth/signup", whenAuthenticated: "redirect" },
    { path: "/auth/forget", whenAuthenticated: "redirect" },
    { path: "/auth/forget/reset", whenAuthenticated: "redirect" },
    { path: "/store/:slug", whenAuthenticated: "next" },
    { path: "/store/:slug/product/:productSlug", whenAuthenticated: "next" },
    { path: "/store/:slug/checkout", whenAuthenticated: "next" },
    { path: "/store/:slug/cart", whenAuthenticated: "next" },
    { path: "/store/:slug/orderPlaced", whenAuthenticated: "next" },
    { path: "/store/:slug/orderConfirmed", whenAuthenticated: "next" },
    { path: "/", whenAuthenticated: "next" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED = "/auth/signin";

const AUTH_RATE_LIMIT = 40;
const AUTH_WINDOW_MS = 60_000;

type RateBucket = { count: number; resetAt: number };
const rateBuckets = new Map<string, RateBucket>();

function matchesRoute(routePath: string, actualPath: string): boolean {
    if (routePath === actualPath) return true;
    if (routePath.includes(":")) {
        const pattern = "^" + routePath.replace(/:[^/]+/g, "[^/]+") + "$";
        return new RegExp(pattern).test(actualPath);
    }
    return false;
}

function getClientIp(req: NextRequest): string {
    const xff = req.headers.get("x-forwarded-for");
    if (xff) return xff.split(",")[0]?.trim() ?? "unknown";
    const realIp = req.headers.get("x-real-ip");
    if (realIp) return realIp.trim();
    return "unknown";
}

function nextWithPathname(req: NextRequest) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-middleware-pathname", req.nextUrl.pathname);
    return NextResponse.next({
        request: { headers: requestHeaders },
    });
}

function checkAuthRateLimit(ip: string): boolean {
    const key = `auth:${ip}`;
    const now = Date.now();
    const b = rateBuckets.get(key);
    if (!b || now > b.resetAt) {
        rateBuckets.set(key, { count: 1, resetAt: now + AUTH_WINDOW_MS });
        return true;
    }
    if (b.count >= AUTH_RATE_LIMIT) return false;
    b.count += 1;
    return true;
}

export default async function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname;

    if (path.startsWith("/auth")) {
        const ip = getClientIp(req);
        if (!checkAuthRateLimit(ip)) {
            return new NextResponse("Muitas tentativas. Tente novamente em breve.", {
                status: 429,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
            });
        }
    }

    const publicRoute = publicRoutes.find((route) =>
        matchesRoute(route.path, path),
    );
    const token = req.cookies.get("token")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return nextWithPathname(req);
    }

    const key = new TextEncoder().encode(secret);

    async function isAccessTokenValid(access: string | undefined): Promise<boolean> {
        if (!access) return false;
        try {
            await jwtVerify(access, key, { algorithms: ["HS256"] });
            return true;
        } catch {
            return false;
        }
    }

    const accessValid = await isAccessTokenValid(token);

    if (!token && !refreshToken && publicRoute) {
        return nextWithPathname(req);
    }

    if (!token && !refreshToken && !publicRoute) {
        const redirectURL = req.nextUrl.clone();
        redirectURL.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
        return NextResponse.redirect(redirectURL);
    }

    if (
        (token || refreshToken) &&
        publicRoute?.whenAuthenticated === "redirect"
    ) {
        const redirectURL = req.nextUrl.clone();
        redirectURL.pathname = "/dashboard";
        return NextResponse.redirect(redirectURL);
    }

    if ((token || refreshToken) && !publicRoute) {
        if (accessValid) {
            return nextWithPathname(req);
        }
        if (refreshToken) {
            const refreshUrl = req.nextUrl.clone();
            refreshUrl.pathname = "/api/auth/refresh";
            refreshUrl.search = "";
            refreshUrl.searchParams.set("next", path);
            return NextResponse.redirect(refreshUrl);
        }
        const redirectURL = req.nextUrl.clone();
        redirectURL.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
        const response = NextResponse.redirect(redirectURL);
        response.cookies.delete("token");
        return response;
    }

    return nextWithPathname(req);
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
    ],
};
