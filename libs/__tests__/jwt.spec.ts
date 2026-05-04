/** @vitest-environment node */
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../env", () => ({
    env: {
        JWT_SECRET: "test-secret-key-that-is-long-enough-for-hs256",
    },
}));

describe("jwt (jose)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("signJwt / signAccessToken", () => {
        it("deve criar um token JWT válido com o payload fornecido", async () => {
            const payload = {
                sub: "user-123",
                name: "John Doe",
                email: "john@example.com",
            };

            const jwt = (await import("../jwt")).default;
            const result = await jwt.signJwt(payload);

            expect(typeof result).toBe("string");
            expect(result.split(".").length).toBe(3);
        });

        it("deve configurar expiração de 15 minutos (token decodificável)", async () => {
            const payload = {
                sub: 456,
                name: "Jane Doe",
                email: "jane@example.com",
            };

            const jwt = (await import("../jwt")).default;
            const token = await jwt.signAccessToken(payload);
            const jwtModule = await import("../jwt");
            const verified = await jwtModule.default.verifyJwt(token);
            expect(verified.name).toBe("Jane Doe");
            expect(verified.email).toBe("jane@example.com");
        });

        it("deve aceitar sub como string ou número", async () => {
            const jwt = (await import("../jwt")).default;

            const payloadWithStringId = {
                sub: "user-123",
                name: "John",
                email: "john@test.com",
            };
            const t1 = await jwt.signJwt(payloadWithStringId);
            const v1 = await jwt.verifyJwt(t1);
            expect(v1.sub).toBe("user-123");

            const payloadWithNumberId = {
                sub: 123,
                name: "Jane",
                email: "jane@test.com",
            };
            const t2 = await jwt.signJwt(payloadWithNumberId);
            const v2 = await jwt.verifyJwt(t2);
            expect(v2.sub).toBe("123");
        });
    });

    describe("verifyJwt", () => {
        it("deve verificar e decodificar um token JWT válido", async () => {
            const payload = {
                sub: "user-123",
                name: "John Doe",
                email: "john@example.com",
            };

            const jwt = (await import("../jwt")).default;
            const token = await jwt.signAccessToken(payload);
            const result = await jwt.verifyJwt(token);

            expect(result.name).toBe(payload.name);
            expect(result.email).toBe(payload.email);
        });

        it("deve lançar erro para token inválido", async () => {
            const jwt = (await import("../jwt")).default;

            await expect(jwt.verifyJwt("not-a-valid-jwt")).rejects.toThrow();
        });

        it("deve lançar erro para token com assinatura errada", async () => {
            const jwt = (await import("../jwt")).default;
            const token = await jwt.signAccessToken({
                sub: 1,
                name: "A",
                email: "a@a.com",
            });
            const tampered = token.slice(0, -4) + "xxxx";

            await expect(jwt.verifyJwt(tampered)).rejects.toThrow();
        });

        it("deve suportar tipo genérico para payload customizado", async () => {
            type CustomPayload = {
                sub: string;
                name: string;
                email: string;
                role: string;
            };

            const jwt = (await import("../jwt")).default;
            const token = await jwt.signAccessToken({
                sub: "user-123",
                name: "John Doe",
                email: "john@example.com",
            });

            const result = await jwt.verifyJwt<CustomPayload & { role?: string }>(token);
            expect(result.email).toBe("john@example.com");
        });
    });
});
