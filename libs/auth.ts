import { cookies } from "next/headers";
import jwt from "./jwt";

/** Lê e valida o access token. Renovação de sessão é feita no proxy e em `/api/auth/refresh`. */
export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    try {
        return await jwt.verifyJwt(token);
    } catch {
        return null;
    }
}
