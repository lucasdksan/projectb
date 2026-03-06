import * as argon2 from "argon2";

function getPepper(): Buffer {
    const pepper = process.env.PASSWORD_PEPPER;
    if (!pepper) {
        throw new Error("PASSWORD_PEPPER must be set in environment variables");
    }
    return Buffer.from(pepper, "utf-8");
}

const argon2Options = (secret: Buffer): argon2.Options => ({
    secret,
});

const crypt = {
    async hashPassword(password: string) {
        const secret = getPepper();
        return argon2.hash(password, argon2Options(secret));
    },

    async comparePassword(password: string, passwordHash: string) {
        const secret = getPepper();
        return argon2.verify(passwordHash, password, argon2Options(secret));
    },

    async hashToken(token: string): Promise<string> {
        return argon2.hash(token);
    },

    async verifyToken(hash: string, token: string): Promise<boolean> {
        return argon2.verify(hash, token);
    },
};

export default crypt;
