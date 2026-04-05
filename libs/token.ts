import { cookies } from "next/headers";

export const ACCESS_TOKEN_MAX_AGE_SEC = 60 * 15;
export const REFRESH_TOKEN_MAX_AGE_SEC = 60 * 60 * 24 * 7;

const ACCESS_MAX_AGE = ACCESS_TOKEN_MAX_AGE_SEC;
const REFRESH_MAX_AGE = REFRESH_TOKEN_MAX_AGE_SEC;

const tokenIntoCookies = {
    async cookiesStoreFn() {
        const cookieStore = await cookies();
        return { cookieStore };
    },

    async set(accessToken: string, refreshToken: string, secure: boolean) {
        const { cookieStore } = await this.cookiesStoreFn();

        cookieStore.set({
            name: "token",
            value: accessToken,
            httpOnly: true,
            secure,
            sameSite: "strict",
            path: "/",
            maxAge: ACCESS_MAX_AGE,
        });

        cookieStore.set({
            name: "refreshToken",
            value: refreshToken,
            httpOnly: true,
            secure,
            sameSite: "strict",
            path: "/",
            maxAge: REFRESH_MAX_AGE,
        });
    },

    async setAccessOnly(token: string, secure: boolean) {
        const { cookieStore } = await this.cookiesStoreFn();
        cookieStore.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure,
            sameSite: "strict",
            path: "/",
            maxAge: ACCESS_MAX_AGE,
        });
    },

    async delete(name: string) {
        const { cookieStore } = await this.cookiesStoreFn();
        cookieStore.delete({ name });
    },

    async deleteAll() {
        const { cookieStore } = await this.cookiesStoreFn();
        cookieStore.delete({ name: "token" });
        cookieStore.delete({ name: "refreshToken" });
    },
};

export default tokenIntoCookies;