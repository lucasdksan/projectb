import { Errors } from "../errors/errors";
import { AuthRepository } from "../repositories/auth.repository";
import { CreateUserDTO, ResetUserDTO, SignInDTO } from "../schemas/auth.schema";
import jwt from "@/libs/jwt";
import crypt from "@/libs/crypt";
import { forget } from "@/libs/forget";
import sendEmail from "./mail.service";

const REFRESH_TOKEN_EXPIRY_DAYS = 7;

function generateRefreshToken(): string {
    return crypto.getRandomValues(new Uint8Array(32))
        .reduce((acc, byte) => acc + byte.toString(16).padStart(2, "0"), "");
}

function createRefreshTokenPayload(userId: number, plainToken: string): string {
    return `${userId}.${plainToken}`;
}

function parseRefreshTokenPayload(payload: string): { userId: number; plainToken: string } | null {
    const dotIndex = payload.indexOf(".");
    if (dotIndex <= 0) return null;
    const userId = parseInt(payload.slice(0, dotIndex), 10);
    if (isNaN(userId)) return null;
    const plainToken = payload.slice(dotIndex + 1);
    if (!plainToken) return null;
    return { userId, plainToken };
}

export const AuthService = {
    async createUser(data: CreateUserDTO) {
        const existingUser = await AuthRepository.exist(data.email);

        if (existingUser) {
            throw Errors.unauthorized("User already exists");
        }

        const hashedPassword = await crypt.hashPassword(data.password);
        const { id, name, email } = await AuthRepository.createUser({
            name: data.name,
            email: data.email,
            password: hashedPassword,
        });

        const accessToken = await jwt.signAccessToken({
            sub: id,
            name: name,
            email: email,
        });

        const plainRefresh = generateRefreshToken();
        const refreshExpires = new Date();
        refreshExpires.setDate(refreshExpires.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
        await AuthRepository.updateUser({
            refreshTokenHash: await crypt.hashToken(plainRefresh),
            refreshTokenExpiresAt: refreshExpires,
        }, id);

        const refreshToken = createRefreshTokenPayload(id, plainRefresh);

        return { token: accessToken, refreshToken, name, email };
    },

    async signIn(dto: SignInDTO) {
        const user = await AuthRepository.findUserByEmail(dto.email);

        if (!user) {
            throw Errors.unauthorized("E-mail ou senha incorretos.");
        }

        const isPasswordValid = await crypt.comparePassword(dto.password, user.password);

        if (!isPasswordValid) {
            throw Errors.unauthorized("E-mail ou senha incorretos.");
        }

        const accessToken = await jwt.signAccessToken({
            sub: user.id,
            name: user.name,
            email: user.email,
        });

        const plainRefresh = generateRefreshToken();
        const refreshExpires = new Date();
        refreshExpires.setDate(refreshExpires.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
        await AuthRepository.updateUser({
            refreshTokenHash: await crypt.hashToken(plainRefresh),
            refreshTokenExpiresAt: refreshExpires,
        }, user.id);

        const refreshToken = createRefreshTokenPayload(user.id, plainRefresh);

        return {
            token: accessToken,
            refreshToken,
            name: user.name,
            email: user.email,
        };
    },

    async refreshSession(refreshTokenPayload: string): Promise<{ token: string; refreshToken: string; name: string; email: string } | null> {
        const parsed = parseRefreshTokenPayload(refreshTokenPayload);
        if (!parsed) return null;

        const user = await AuthRepository.findUserById(parsed.userId);
        if (!user?.refreshTokenHash || !user.refreshTokenExpiresAt) return null;

        const now = new Date();
        if (now > user.refreshTokenExpiresAt) return null;

        const isValid = await crypt.verifyToken(user.refreshTokenHash, parsed.plainToken);
        if (!isValid) return null;

        const accessToken = await jwt.signAccessToken({
            sub: user.id,
            name: user.name,
            email: user.email,
        });

        const plainRefresh = generateRefreshToken();
        const refreshExpires = new Date();
        refreshExpires.setDate(refreshExpires.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
        await AuthRepository.updateUser({
            refreshTokenHash: await crypt.hashToken(plainRefresh),
            refreshTokenExpiresAt: refreshExpires,
        }, user.id);

        const refreshToken = createRefreshTokenPayload(user.id, plainRefresh);

        return {
            token: accessToken,
            refreshToken,
            name: user.name,
            email: user.email,
        };
    },

    async forgot(email: string) {
        const user = await AuthRepository.findUserByEmail(email);

        if (!user) {
            return { status: true };
        }

        const { now, token } = forget.generateDateAndToken();
        const tokenHash = await crypt.hashToken(token);
        const newUser = await AuthRepository.updateUser({
            passwordResetExpires: now,
            passwordResetToken: tokenHash,
        }, user.id);

        await sendEmail({
            from: "projectb@gmail.com",
            html: `
                Utilize esse token para modificar sua senha ${token}
            `,
            subject: "Token para alterar senha",
            text: "",
            to: newUser.email
        });

        return {
            status: true,
        }
    },

    async reset(dto: ResetUserDTO) {
        const user = await AuthRepository.findUserByEmail(dto.email);

        if (!user) {
            throw Errors.unauthorized("Não foi possível redefinir a senha.");
        }

        const { passwordResetToken, passwordResetExpires } = user;
        const { message, success } = await forget.validateToken({ passwordResetToken, passwordResetExpires, token: dto.token });

        if(message && !success) throw Errors.validation(message);

        const hashedPassword = await crypt.hashPassword(dto.password);
        await AuthRepository.updateUser({
            passwordResetToken: "",
            password: hashedPassword,
            refreshTokenHash: null,
            refreshTokenExpiresAt: null,
        }, user.id);

        const plainRefresh = generateRefreshToken();
        const refreshExpires = new Date();
        refreshExpires.setDate(refreshExpires.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
        await AuthRepository.updateUser({
            refreshTokenHash: await crypt.hashToken(plainRefresh),
            refreshTokenExpiresAt: refreshExpires,
        }, user.id);

        const accessToken = await jwt.signAccessToken({
            sub: user.id,
            name: user.name,
            email: user.email,
        });
        const refreshToken = createRefreshTokenPayload(user.id, plainRefresh);

        return {
            status: true,
            token: accessToken,
            refreshToken,
        };
    }
}