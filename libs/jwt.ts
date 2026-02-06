import jsonwebtoken from "jsonwebtoken"
import { env } from "./env";

export type JwtPayload =  {
    sub: string | number;
    name: string;
    email: string;
}

const JWT_SECRET = env.JWT_SECRET as string;

const jwt = {
    signJwt(payload: JwtPayload): string {
        return jsonwebtoken.sign(payload, JWT_SECRET, {
            expiresIn: "7d",
        });
    },

    verifyJwt<T = JwtPayload>(token: string): T {
        return jsonwebtoken.verify(token, JWT_SECRET) as T;
    }
};

export default jwt;