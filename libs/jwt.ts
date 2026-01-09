import jwt from "jsonwebtoken"
import { env } from "./env";

const JWT_SECRET = env.JWT_SECRET as string;

export interface JwtPayload {
    sub: string | number;
    name: string;
    email: string;
}

export function signJwt(payload: JwtPayload) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "7d",
    });
}

export function verifyJwt<T = JwtPayload>(token: string): T {
    return jwt.verify(token, JWT_SECRET) as T;
}
