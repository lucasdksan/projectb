import { describe, it, expect, vi, beforeEach } from "vitest";
import { cookies } from "next/headers";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("../jwt", () => ({
  default: {
    verifyJwt: vi.fn(),
  },
}));

describe("getCurrentUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar null quando não houver token nos cookies", async () => {
    const mockCookies = {
      get: vi.fn().mockReturnValue(undefined),
    };
    vi.mocked(cookies).mockResolvedValue(mockCookies as never);

    const { getCurrentUser } = await import("../auth");
    const result = await getCurrentUser();

    expect(result).toBeNull();
    expect(mockCookies.get).toHaveBeenCalledWith("token");
  });

  it("deve retornar o usuário quando o token for válido", async () => {
    const mockUser = {
      sub: "123",
      name: "John Doe",
      email: "john@example.com",
    };

    const mockCookies = {
      get: vi.fn((name: string) => {
        if (name === "token") return { value: "valid-token" };
        return undefined;
      }),
    };
    vi.mocked(cookies).mockResolvedValue(mockCookies as never);

    const jwt = await import("../jwt");
    vi.mocked(jwt.default.verifyJwt).mockResolvedValue(mockUser);

    const { getCurrentUser } = await import("../auth");
    const result = await getCurrentUser();

    expect(result).toEqual(mockUser);
    expect(jwt.default.verifyJwt).toHaveBeenCalledWith("valid-token");
  });

  it("deve retornar null quando o token for inválido", async () => {
    const mockCookies = {
      get: vi.fn((name: string) => {
        if (name === "token") return { value: "invalid-token" };
        return undefined;
      }),
    };
    vi.mocked(cookies).mockResolvedValue(mockCookies as never);

    const jwt = await import("../jwt");
    vi.mocked(jwt.default.verifyJwt).mockImplementation(async () => {
      throw new Error("Invalid token");
    });

    const { getCurrentUser } = await import("../auth");
    const result = await getCurrentUser();

    expect(result).toBeNull();
  });

  it("deve retornar null quando o token estiver expirado", async () => {
    const mockCookies = {
      get: vi.fn((name: string) => {
        if (name === "token") return { value: "expired-token" };
        return undefined;
      }),
    };
    vi.mocked(cookies).mockResolvedValue(mockCookies as never);

    const jwt = await import("../jwt");
    vi.mocked(jwt.default.verifyJwt).mockImplementation(async () => {
      throw new Error("Token expired");
    });

    const { getCurrentUser } = await import("../auth");
    const result = await getCurrentUser();

    expect(result).toBeNull();
  });
});
