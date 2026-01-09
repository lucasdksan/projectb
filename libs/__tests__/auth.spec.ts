import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCurrentUser } from "../auth";
import { verifyJwt } from "../jwt";
import { cookies } from "next/headers";

vi.mock("../jwt", () => ({
  verifyJwt: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

describe("getCurrentUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar null quando verifyJwt lançar erro", async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: "invalid-token" }),
    } as any);

    vi.mocked(verifyJwt).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const result = await getCurrentUser();

    expect(verifyJwt).toHaveBeenCalledWith("invalid-token");
    expect(result).toBeNull();
  });
});
