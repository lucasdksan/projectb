import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";

vi.mock("../env", () => ({
  env: {
    JWT_SECRET: "test-secret",
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn(),
  },
}));

import { signJwt, verifyJwt, JwtPayload } from "../jwt";

describe("JWT utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("signJwt deve chamar jwt.sign com payload, secret e options corretos", () => {
    const payload: JwtPayload = {
      sub: "1",
      name: "Lucas",
      email: "lucas@email.com",
    };

    (jwt.sign as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      "signed-token"
    );

    const token = signJwt(payload);

    expect(jwt.sign).toHaveBeenCalledWith(payload, "test-secret", {
      expiresIn: "7d",
    });

    expect(token).toBe("signed-token");
  });

  it("verifyJwt deve retornar o payload decodificado", () => {
    const decodedPayload = {
      sub: "1",
      name: "Lucas",
      email: "lucas@email.com",
    };

    (jwt.verify as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      decodedPayload
    );

    const result = verifyJwt("valid-token");

    expect(jwt.verify).toHaveBeenCalledWith("valid-token", "test-secret");
    expect(result).toEqual(decodedPayload);
  });

  it("verifyJwt deve lançar erro quando o token for inválido", () => {
    (jwt.verify as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    expect(() => verifyJwt("invalid-token")).toThrow("Invalid token");
  });
});
