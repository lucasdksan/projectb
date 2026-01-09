import { describe, it, expect, beforeEach, vi } from "vitest";
import { forget } from "../forget";

describe("forget module", () => {
  beforeEach(() => {
    forget.now = new Date("2024-01-01T12:00:00Z");
   
    vi.spyOn(crypto, "randomUUID").mockReturnValue("11111111-1111-1111-1111-111111111111");
  });

  it("should generate token and expiration date correctly", () => {
    const { now, token } = forget.generateDateAndToken();

    expect(token).toBe("11111111-1111-1111-1111-111111111111");
    expect(now.toISOString()).toBe("2024-01-01T13:00:00.000Z");
  });

  it("should validate token successfully", () => {
    const expiresAt = new Date("2024-01-01T13:00:00Z");

    const result = forget.validateToken({
      passwordResetExpires: expiresAt,
      passwordResetToken: "11111111-1111-1111-1111-111111111111",
      token: "11111111-1111-1111-1111-111111111111"
    });

    expect(result).toEqual({ success: true, message: null });
  });

  it("should fail when token is missing", () => {
    const result = forget.validateToken({
      passwordResetExpires: null,
      passwordResetToken: "11111111-1111-1111-1111-111111111111",
      token: "11111111-1111-1111-1111-111111111111"
    });

    expect(result).toEqual({ success: false, message: "Tempo não registrado" });
  });

  it("should fail with invalid token", () => {
    const expiresAt = new Date("2024-01-01T13:00:00Z");

    const result = forget.validateToken({
      passwordResetExpires: expiresAt,
      passwordResetToken: "11111111-1111-1111-1111-111111111111",
      token: "wrong-token"
    });

    expect(result).toEqual({ success: false, message: "Token inválido" });
  });

  it("should fail when token is expired", () => {
    const expiresAt = new Date("2024-01-01T11:00:00Z");

    const result = forget.validateToken({
      passwordResetExpires: expiresAt,
      passwordResetToken: "11111111-1111-1111-1111-111111111111",
      token: "11111111-1111-1111-1111-111111111111"
    });

    expect(result).toEqual({ success: false, message: "Token sem validade" });
  });

});
