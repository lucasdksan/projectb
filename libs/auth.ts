import { cookies } from "next/headers";
import { verifyJwt } from "./jwt";  

export async function getCurrentUser() {
    const token = (await cookies()).get("token")?.value;
    if (!token) return null;

    try {
        return verifyJwt(token);
    } catch {
        return null;
    }
}
