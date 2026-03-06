import crypt from "./crypt";

export const forget = {
    now: new Date(),

    getCurrentTime() {
        return new Date();
    },

    generateDateAndToken() {
        const now = this.getCurrentTime();
        const expiresAt = new Date(now.getTime());
        expiresAt.setHours(expiresAt.getHours() + 1);
        const token = crypto.randomUUID();

        return {
            now: expiresAt,
            token,
        };
    },

    async validateToken({
        passwordResetExpires,
        passwordResetToken,
        token,
    }: {
        passwordResetToken: string | null;
        passwordResetExpires: Date | null;
        token: string;
    }): Promise<{ success: boolean; message: string | null }> {
        const now = this.getCurrentTime();

        if (!passwordResetExpires) return { success: false, message: "Tempo não registrado" };
        if (!passwordResetToken) return { success: false, message: "Token inválido" };
        if (now > passwordResetExpires) return { success: false, message: "Token sem validade" };

        const isTokenValid = await crypt.verifyToken(passwordResetToken, token);
        if (!isTokenValid) return { success: false, message: "Token inválido" };

        return { success: true, message: null };
    },
};