import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

const crypt = {
    async hashPassword(password: string) {
        return bcrypt.hash(password, SALT_ROUNDS);
    },

    async comparePassword(password: string, passwordHash: string) {
        return bcrypt.compare(password, passwordHash);
    }
}

export default crypt;