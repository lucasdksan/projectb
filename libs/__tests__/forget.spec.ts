import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { forget } from "../forget";
import crypt from "../crypt";

describe("forget", () => {
  let randomUUIDSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    randomUUIDSpy = vi.spyOn(crypto, "randomUUID").mockReturnValue("mocked-uuid-12345");
  });

  afterEach(() => {
    randomUUIDSpy.mockRestore();
  });

  describe("generateDateAndToken", () => {
    it("deve gerar um token UUID e uma data com 1 hora a mais", () => {
      const result = forget.generateDateAndToken();

      expect(result.token).toBe("mocked-uuid-12345");
      expect(result.now).toBeInstanceOf(Date);
      expect(crypto.randomUUID).toHaveBeenCalled();
    });

    it("deve adicionar 1 hora à data atual", () => {
      const mockNow = new Date("2024-01-01T12:00:00");
      vi.spyOn(forget, "getCurrentTime").mockReturnValue(mockNow);

      const result = forget.generateDateAndToken();
      const expectedTime = new Date("2024-01-01T13:00:00");

      expect(result.now.getTime()).toBe(expectedTime.getTime());
      vi.restoreAllMocks();
    });
  });

  describe("validateToken", () => {
    it("deve retornar erro quando passwordResetExpires for null", async () => {
      const result = await forget.validateToken({
        passwordResetToken: "some-hash",
        passwordResetExpires: null,
        token: "some-token",
      });

      expect(result).toEqual({
        success: false,
        message: "Tempo não registrado",
      });
    });

    it("deve retornar erro quando o token não corresponder", async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 2);
      const validHash = await crypt.hashToken("token-123");

      const result = await forget.validateToken({
        passwordResetToken: validHash,
        passwordResetExpires: futureDate,
        token: "different-token",
      });

      expect(result).toEqual({
        success: false,
        message: "Token inválido",
      });
    });

    it("deve retornar erro quando o token estiver expirado", async () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 2);
      const validHash = await crypt.hashToken("token-123");

      const result = await forget.validateToken({
        passwordResetToken: validHash,
        passwordResetExpires: pastDate,
        token: "token-123",
      });

      expect(result).toEqual({
        success: false,
        message: "Token sem validade",
      });
    });

    it("deve retornar sucesso quando o token for válido e não expirado", async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 2);
      const validHash = await crypt.hashToken("token-123");

      const result = await forget.validateToken({
        passwordResetToken: validHash,
        passwordResetExpires: futureDate,
        token: "token-123",
      });

      expect(result).toEqual({
        success: true,
        message: null,
      });
    });

    it("deve retornar erro quando passwordResetToken for null", async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 2);

      const result = await forget.validateToken({
        passwordResetToken: null,
        passwordResetExpires: futureDate,
        token: "token-123",
      });

      expect(result).toEqual({
        success: false,
        message: "Token inválido",
      });
    });

    it("deve validar token exatamente no limite de expiração", async () => {
      const mockNow = new Date("2024-01-01T12:00:00");
      vi.spyOn(forget, "getCurrentTime").mockReturnValue(mockNow);
      const exactExpirationDate = new Date("2024-01-01T12:00:00");
      const validHash = await crypt.hashToken("token-123");

      const result = await forget.validateToken({
        passwordResetToken: validHash,
        passwordResetExpires: exactExpirationDate,
        token: "token-123",
      });

      expect(result).toEqual({
        success: true,
        message: null,
      });
      vi.restoreAllMocks();
    });
  });
});
