import { cookies } from "next/headers";
import jwt from "./jwt";  

export async function getCurrentUser() {
    const token = (await cookies()).get("token")?.value;
    if (!token) return null;

    try {
        return jwt.verifyJwt(token);
    } catch {
        return null;
    }
}