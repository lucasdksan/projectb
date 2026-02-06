import { NextResponse, type NextRequest } from "next/server";

function isTokenExpired(token: string): boolean {
    try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        const exp = decoded.exp;

        if (!exp) return true;

        return Date.now() >= exp * 1000;
    } catch {
        return true;
    }
}

const publicRoutes = [
    { path: "/auth/signin", whenAuthenticated: "redirect" },
    { path: "/auth/signup", whenAuthenticated: "redirect" },
    { path: "/auth/forget", whenAuthenticated: "redirect" },
    { path: "/auth/forget/reset", whenAuthenticated: "redirect" },
    { path: "/", whenAuthenticated: "next" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED = "/auth/signin";

export default function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const publicRoute = publicRoutes.find(route => route.path === path);
    const authToken = req.cookies.get("token")?.value;

    if (!authToken && publicRoute) {
        return NextResponse.next();
    }

    if (!authToken && !publicRoute) {
        const redirectURL = req.nextUrl.clone();
        redirectURL.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;

        return NextResponse.redirect(redirectURL);
    }

    if (authToken && publicRoute?.whenAuthenticated === "redirect") {
        const redirectURL = req.nextUrl.clone();
        redirectURL.pathname = "/dashboard";

        return NextResponse.redirect(redirectURL);
    }

    if (authToken && !publicRoute) {
        if (isTokenExpired(authToken)) {
            const redirectURL = req.nextUrl.clone();
            redirectURL.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;

            const response = NextResponse.redirect(redirectURL);
            response.cookies.delete("token");

            return response;
        }

        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
    ],
};
