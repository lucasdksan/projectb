import { cookies } from "next/headers";

const tokenIntoCookies = {
    async cookiesStoreFn(){
        const cookieStore = await cookies();

        return  { cookieStore };
    },

    async set(token: string, secure: boolean) {
        const { cookieStore } = await this.cookiesStoreFn();

        cookieStore.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure,
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });
    },

    async delete(name: string){
        const { cookieStore } = await this.cookiesStoreFn();

        cookieStore.delete({
            name
        });    
    }
}

export default tokenIntoCookies;