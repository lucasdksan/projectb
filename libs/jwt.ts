import { SignJWT, jwtVerify } from "jose";
import { env } from "./env";

export type JwtPayload = {
    sub: string | number;
    name: string;
    email: string;
};

const JWT_SECRET = env.JWT_SECRET as string;
const ACCESS_TOKEN_EXPIRY = "15m";

function getSecretKey() {
    return new TextEncoder().encode(JWT_SECRET);
}

const jwt = {
    async signAccessToken(payload: JwtPayload): Promise<string> {
        const key = getSecretKey();
        return await new SignJWT({
            name: payload.name,
            email: payload.email,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setSubject(String(payload.sub))
            .setExpirationTime(ACCESS_TOKEN_EXPIRY)
            .sign(key);
    },

    async signJwt(payload: JwtPayload): Promise<string> {
        return await this.signAccessToken(payload);
    },

    async verifyJwt<T = JwtPayload>(token: string): Promise<T> {
        const { payload } = await jwtVerify(token, getSecretKey(), {
            algorithms: ["HS256"],
        });
        return payload as T;
    },
};

export default jwt;
