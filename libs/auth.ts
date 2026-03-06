import { cookies } from "next/headers";
import jwt from "./jwt";
import tokenIntoCookies from "./token";
import { AuthController } from "@/backend/controllers/auth.controller";
import { env } from "./env";

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (token) {
        try {
            return jwt.verifyJwt(token);
        } catch {
            const refreshed = await AuthController.refreshSession(refreshToken!);
            
            if (refreshed) {
                await tokenIntoCookies.set(refreshed.token, refreshed.refreshToken, env.NODE_ENV === "production");
                return jwt.verifyJwt(refreshed.token);
            }
        }
    }

    if (refreshToken) {
        const refreshed = await AuthController.refreshSession(refreshToken);
        if (refreshed) {
            await tokenIntoCookies.set(refreshed.token, refreshed.refreshToken, env.NODE_ENV === "production");
            return jwt.verifyJwt(refreshed.token);
        }
    }

    return null;
}