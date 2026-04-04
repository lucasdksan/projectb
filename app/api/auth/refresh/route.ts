import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthService } from "@/backend/services/auth.service";
import { env } from "@/libs/env";
import {
    ACCESS_TOKEN_MAX_AGE_SEC,
    REFRESH_TOKEN_MAX_AGE_SEC,
} from "@/libs/token";

function safeNextPath(next: string | null): string {
    if (!next || typeof next !== "string") return "/dashboard";
    const trimmed = next.trim();
    if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return "/dashboard";
    if (trimmed.includes("://") || trimmed.includes("\\")) return "/dashboard";
    return trimmed;
}

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    const refreshed = await AuthService.refreshSession(refreshToken);
    const signinUrl = new URL("/auth/signin", request.url);

    if (!refreshed) {
        const res = NextResponse.redirect(signinUrl);
        res.cookies.delete("token");
        res.cookies.delete("refreshToken");
        return res;
    }

    const nextPath = safeNextPath(request.nextUrl.searchParams.get("next"));
    const res = NextResponse.redirect(new URL(nextPath, request.url));
    const secure = env.NODE_ENV === "production";

    res.cookies.set("token", refreshed.token, {
        httpOnly: true,
        secure,
        sameSite: "strict",
        path: "/",
        maxAge: ACCESS_TOKEN_MAX_AGE_SEC,
    });
    res.cookies.set("refreshToken", refreshed.refreshToken, {
        httpOnly: true,
        secure,
        sameSite: "strict",
        path: "/",
        maxAge: REFRESH_TOKEN_MAX_AGE_SEC,
    });

    return res;
}
