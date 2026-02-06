import { describe, it, expect, vi } from "vitest";
import bcrypt from "bcryptjs";

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

describe("crypt", () => {
  describe("hashPassword", () => {
    it("deve fazer hash de uma senha usando bcrypt", async () => {
      const password = "mySecurePassword123";
      const hashedPassword = "$2a$10$hashedPasswordExample";

      vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as never);

      const crypt = (await import("../crypt")).default;
      const result = await crypt.hashPassword(password);

      expect(result).toBe(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });

    it("deve usar SALT_ROUNDS de 10", async () => {
      const password = "testPassword";
      vi.mocked(bcrypt.hash).mockResolvedValue("hashed" as never);

      const crypt = (await import("../crypt")).default;
      await crypt.hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });

    it("deve propagar erro se bcrypt.hash falhar", async () => {
      const password = "testPassword";
      const error = new Error("Hashing failed");

      vi.mocked(bcrypt.hash).mockRejectedValue(error);

      const crypt = (await import("../crypt")).default;

      await expect(crypt.hashPassword(password)).rejects.toThrow(
        "Hashing failed"
      );
    });
  });

  describe("comparePassword", () => {
    it("deve retornar true quando a senha corresponder ao hash", async () => {
      const password = "mySecurePassword123";
      const passwordHash = "$2a$10$hashedPasswordExample";

      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

      const crypt = (await import("../crypt")).default;
      const result = await crypt.comparePassword(password, passwordHash);

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, passwordHash);
    });

    it("deve retornar false quando a senha não corresponder ao hash", async () => {
      const password = "wrongPassword";
      const passwordHash = "$2a$10$hashedPasswordExample";

      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      const crypt = (await import("../crypt")).default;
      const result = await crypt.comparePassword(password, passwordHash);

      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, passwordHash);
    });

    it("deve propagar erro se bcrypt.compare falhar", async () => {
      const password = "testPassword";
      const passwordHash = "$2a$10$hash";
      const error = new Error("Comparison failed");

      vi.mocked(bcrypt.compare).mockRejectedValue(error);

      const crypt = (await import("../crypt")).default;

      await expect(
        crypt.comparePassword(password, passwordHash)
      ).rejects.toThrow("Comparison failed");
    });
  });
});
