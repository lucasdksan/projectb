import { describe, it, expect, vi, beforeEach } from "vitest";
import jsonwebtoken from "jsonwebtoken";

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn(),
  },
}));

vi.mock("../env", () => ({
  env: {
    JWT_SECRET: "test-secret-key",
  },
}));

describe("jwt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("signJwt", () => {
    it("deve criar um token JWT válido com o payload fornecido", async () => {
      const payload = {
        sub: "user-123",
        name: "John Doe",
        email: "john@example.com",
      };
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

      vi.mocked(jsonwebtoken.sign).mockReturnValue(mockToken as any);

      const jwt = (await import("../jwt")).default;
      const result = jwt.signJwt(payload);

      expect(result).toBe(mockToken);
      expect(jsonwebtoken.sign).toHaveBeenCalledWith(
        payload,
        "test-secret-key",
        { expiresIn: "7d" }
      );
    });

    it("deve configurar expiração de 7 dias", async () => {
      const payload = {
        sub: 456,
        name: "Jane Doe",
        email: "jane@example.com",
      };

      vi.mocked(jsonwebtoken.sign).mockReturnValue("token" as any);

      const jwt = (await import("../jwt")).default;
      jwt.signJwt(payload);

      expect(jsonwebtoken.sign).toHaveBeenCalledWith(
        payload,
        "test-secret-key",
        { expiresIn: "7d" }
      );
    });

    it("deve aceitar sub como string ou número", async () => {
      const payloadWithStringId = {
        sub: "user-123",
        name: "John",
        email: "john@test.com",
      };
      const payloadWithNumberId = {
        sub: 123,
        name: "Jane",
        email: "jane@test.com",
      };

      vi.mocked(jsonwebtoken.sign).mockReturnValue("token" as any);

      const jwt = (await import("../jwt")).default;
      
      jwt.signJwt(payloadWithStringId);
      expect(jsonwebtoken.sign).toHaveBeenCalledWith(
        payloadWithStringId,
        "test-secret-key",
        { expiresIn: "7d" }
      );

      jwt.signJwt(payloadWithNumberId);
      expect(jsonwebtoken.sign).toHaveBeenCalledWith(
        payloadWithNumberId,
        "test-secret-key",
        { expiresIn: "7d" }
      );
    });
  });

  describe("verifyJwt", () => {
    it("deve verificar e decodificar um token JWT válido", async () => {
      const token = "valid.jwt.token";
      const decodedPayload = {
        sub: "user-123",
        name: "John Doe",
        email: "john@example.com",
      };

      vi.mocked(jsonwebtoken.verify).mockReturnValue(decodedPayload as any);

      const jwt = (await import("../jwt")).default;
      const result = jwt.verifyJwt(token);

      expect(result).toEqual(decodedPayload);
      expect(jsonwebtoken.verify).toHaveBeenCalledWith(
        token,
        "test-secret-key"
      );
    });

    it("deve lançar erro para token inválido", async () => {
      const token = "invalid.token";

      vi.mocked(jsonwebtoken.verify).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const jwt = (await import("../jwt")).default;

      expect(() => jwt.verifyJwt(token)).toThrow("Invalid token");
    });

    it("deve lançar erro para token expirado", async () => {
      const token = "expired.token";

      vi.mocked(jsonwebtoken.verify).mockImplementation(() => {
        throw new Error("Token expired");
      });

      const jwt = (await import("../jwt")).default;

      expect(() => jwt.verifyJwt(token)).toThrow("Token expired");
    });

    it("deve suportar tipo genérico para payload customizado", async () => {
      type CustomPayload = {
        sub: string;
        name: string;
        email: string;
        role: string;
      };

      const token = "custom.token";
      const customPayload: CustomPayload = {
        sub: "user-123",
        name: "John Doe",
        email: "john@example.com",
        role: "admin",
      };

      vi.mocked(jsonwebtoken.verify).mockReturnValue(customPayload as any);

      const jwt = (await import("../jwt")).default;
      const result = jwt.verifyJwt<CustomPayload>(token);

      expect(result).toEqual(customPayload);
      expect(result.role).toBe("admin");
    });
  });
});
