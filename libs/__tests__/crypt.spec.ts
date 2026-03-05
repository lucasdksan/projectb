import { describe, it, expect, vi, beforeEach } from "vitest";
import argon2 from "argon2";

vi.mock("argon2", () => ({
  default: {
    hash: vi.fn(),
    verify: vi.fn(),
  },
}));

const MOCK_PEPPER = "test-pepper";

describe("crypt", () => {
  beforeEach(() => {
    process.env.PASSWORD_PEPPER = MOCK_PEPPER;
    vi.resetModules();
  });

  describe("hashPassword", () => {
    it("deve fazer hash de uma senha usando argon2 com pepper", async () => {
      const password = "mySecurePassword123";
      const hashedPassword = "$argon2id$v=19$m=65536,t=3,p=4$example";

      vi.mocked(argon2.hash).mockResolvedValue(hashedPassword);

      const crypt = (await import("../crypt")).default;
      const result = await crypt.hashPassword(password);

      expect(result).toBe(hashedPassword);
      expect(argon2.hash).toHaveBeenCalledWith(
        password,
        expect.objectContaining({
          secret: Buffer.from(MOCK_PEPPER, "utf-8"),
        })
      );
    });

    it("deve usar o pepper das variáveis de ambiente", async () => {
      const password = "testPassword";
      vi.mocked(argon2.hash).mockResolvedValue("hashed");

      const crypt = (await import("../crypt")).default;
      await crypt.hashPassword(password);

      expect(argon2.hash).toHaveBeenCalledWith(
        password,
        expect.objectContaining({
          secret: Buffer.from(MOCK_PEPPER, "utf-8"),
        })
      );
    });

    it("deve propagar erro se argon2.hash falhar", async () => {
      const password = "testPassword";
      const error = new Error("Hashing failed");

      vi.mocked(argon2.hash).mockRejectedValue(error);

      const crypt = (await import("../crypt")).default;

      await expect(crypt.hashPassword(password)).rejects.toThrow(
        "Hashing failed"
      );
    });

    it("deve lançar erro se PASSWORD_PEPPER não estiver definido", async () => {
      delete process.env.PASSWORD_PEPPER;

      const crypt = (await import("../crypt")).default;

      await expect(crypt.hashPassword("password")).rejects.toThrow(
        "PASSWORD_PEPPER must be set in environment variables"
      );
    });
  });

  describe("comparePassword", () => {
    it("deve retornar true quando a senha corresponder ao hash", async () => {
      const password = "mySecurePassword123";
      const passwordHash = "$argon2id$v=19$m=65536,t=3,p=4$example";

      vi.mocked(argon2.verify).mockResolvedValue(true);

      const crypt = (await import("../crypt")).default;
      const result = await crypt.comparePassword(password, passwordHash);

      expect(result).toBe(true);
      expect(argon2.verify).toHaveBeenCalledWith(
        passwordHash,
        password,
        expect.objectContaining({
          secret: Buffer.from(MOCK_PEPPER, "utf-8"),
        })
      );
    });

    it("deve retornar false quando a senha não corresponder ao hash", async () => {
      const password = "wrongPassword";
      const passwordHash = "$argon2id$v=19$m=65536,t=3,p=4$example";

      vi.mocked(argon2.verify).mockResolvedValue(false);

      const crypt = (await import("../crypt")).default;
      const result = await crypt.comparePassword(password, passwordHash);

      expect(result).toBe(false);
      expect(argon2.verify).toHaveBeenCalledWith(
        passwordHash,
        password,
        expect.objectContaining({
          secret: Buffer.from(MOCK_PEPPER, "utf-8"),
        })
      );
    });

    it("deve propagar erro se argon2.verify falhar", async () => {
      const password = "testPassword";
      const passwordHash = "$argon2id$v=19$hash";
      const error = new Error("Comparison failed");

      vi.mocked(argon2.verify).mockRejectedValue(error);

      const crypt = (await import("../crypt")).default;

      await expect(
        crypt.comparePassword(password, passwordHash)
      ).rejects.toThrow("Comparison failed");
    });

    it("deve lançar erro se PASSWORD_PEPPER não estiver definido", async () => {
      delete process.env.PASSWORD_PEPPER;

      const crypt = (await import("../crypt")).default;

      await expect(
        crypt.comparePassword("password", "hash")
      ).rejects.toThrow("PASSWORD_PEPPER must be set in environment variables");
    });
  });
});
