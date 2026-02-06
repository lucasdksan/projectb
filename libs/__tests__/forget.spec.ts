import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { forget } from "../forget";

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
      const originalNow = new Date(forget.now);
      const result = forget.generateDateAndToken();
      const expectedTime = new Date(originalNow);
      expectedTime.setHours(expectedTime.getHours() + 1);

      expect(result.now.getTime()).toBe(expectedTime.getTime());
    });
  });

  describe("validateToken", () => {
    it("deve retornar erro quando passwordResetExpires for null", () => {
      const result = forget.validateToken({
        passwordResetToken: "some-token",
        passwordResetExpires: null,
        token: "some-token",
      });

      expect(result).toEqual({
        success: false,
        message: "Tempo não registrado",
      });
    });

    it("deve retornar erro quando o token não corresponder", () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 2);

      const result = forget.validateToken({
        passwordResetToken: "token-123",
        passwordResetExpires: futureDate,
        token: "different-token",
      });

      expect(result).toEqual({
        success: false,
        message: "Token inválido",
      });
    });

    it("deve retornar erro quando o token estiver expirado", () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 2);

      const result = forget.validateToken({
        passwordResetToken: "token-123",
        passwordResetExpires: pastDate,
        token: "token-123",
      });

      expect(result).toEqual({
        success: false,
        message: "Token sem validade",
      });
    });

    it("deve retornar sucesso quando o token for válido e não expirado", () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 2);

      const result = forget.validateToken({
        passwordResetToken: "token-123",
        passwordResetExpires: futureDate,
        token: "token-123",
      });

      expect(result).toEqual({
        success: true,
        message: null,
      });
    });

    it("deve validar token exatamente no limite de expiração", () => {
      const exactExpirationDate = new Date(forget.now);

      const result = forget.validateToken({
        passwordResetToken: "token-123",
        passwordResetExpires: exactExpirationDate,
        token: "token-123",
      });

      expect(result).toEqual({
        success: true,
        message: null,
      });
    });
  });
});
