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

    validateToken({
        passwordResetExpires,
        passwordResetToken,
        token,
    }: {
        passwordResetToken: string | null;
        passwordResetExpires: Date | null;
        token: string;
    }) {
        const now = this.getCurrentTime();

        if (!passwordResetExpires) return { success: false, message: "Tempo não registrado" };
        if (passwordResetToken !== token) return { success: false, message: "Token inválido" };
        if (now > passwordResetExpires) return { success: false, message: "Token sem validade" };

        return { success: true, message: null };
    },
};