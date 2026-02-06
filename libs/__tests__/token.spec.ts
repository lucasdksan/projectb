import { describe, it, expect, vi, beforeEach } from "vitest";
import { cookies } from "next/headers";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

describe("tokenIntoCookies", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("cookiesStoreFn", () => {
    it("deve retornar o cookieStore", async () => {
      const mockCookieStore = {
        set: vi.fn(),
        get: vi.fn(),
        delete: vi.fn(),
      };

      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any);

      const tokenIntoCookies = (await import("../token")).default;
      const result = await tokenIntoCookies.cookiesStoreFn();

      expect(result.cookieStore).toBe(mockCookieStore);
      expect(cookies).toHaveBeenCalled();
    });
  });

  describe("set", () => {
    it("deve configurar o token nos cookies com secure true", async () => {
      const mockCookieStore = {
        set: vi.fn(),
      };

      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any);

      const tokenIntoCookies = (await import("../token")).default;
      await tokenIntoCookies.set("my-jwt-token", true);

      expect(mockCookieStore.set).toHaveBeenCalledWith({
        name: "token",
        value: "my-jwt-token",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      });
    });

    it("deve configurar o token nos cookies com secure false", async () => {
      const mockCookieStore = {
        set: vi.fn(),
      };

      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any);

      const tokenIntoCookies = (await import("../token")).default;
      await tokenIntoCookies.set("my-jwt-token", false);

      expect(mockCookieStore.set).toHaveBeenCalledWith({
        name: "token",
        value: "my-jwt-token",
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    });

    it("deve configurar cookie com httpOnly e sameSite strict", async () => {
      const mockCookieStore = {
        set: vi.fn(),
      };

      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any);

      const tokenIntoCookies = (await import("../token")).default;
      await tokenIntoCookies.set("test-token", true);

      const callArgs = mockCookieStore.set.mock.calls[0][0];
      expect(callArgs.httpOnly).toBe(true);
      expect(callArgs.sameSite).toBe("strict");
      expect(callArgs.path).toBe("/");
    });

    it("deve configurar maxAge para 7 dias (604800 segundos)", async () => {
      const mockCookieStore = {
        set: vi.fn(),
      };

      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any);

      const tokenIntoCookies = (await import("../token")).default;
      await tokenIntoCookies.set("test-token", true);

      const callArgs = mockCookieStore.set.mock.calls[0][0];
      expect(callArgs.maxAge).toBe(604800); // 60 * 60 * 24 * 7
    });
  });

  describe("delete", () => {
    it("deve deletar um cookie pelo nome", async () => {
      const mockCookieStore = {
        delete: vi.fn(),
      };

      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any);

      const tokenIntoCookies = (await import("../token")).default;
      await tokenIntoCookies.delete("token");

      expect(mockCookieStore.delete).toHaveBeenCalledWith({
        name: "token",
      });
    });

    it("deve deletar qualquer cookie especificado", async () => {
      const mockCookieStore = {
        delete: vi.fn(),
      };

      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any);

      const tokenIntoCookies = (await import("../token")).default;
      await tokenIntoCookies.delete("refresh_token");

      expect(mockCookieStore.delete).toHaveBeenCalledWith({
        name: "refresh_token",
      });
    });

    it("deve chamar cookiesStoreFn antes de deletar", async () => {
      const mockCookieStore = {
        delete: vi.fn(),
      };

      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any);

      const tokenIntoCookies = (await import("../token")).default;
      await tokenIntoCookies.delete("test");

      expect(cookies).toHaveBeenCalled();
      expect(mockCookieStore.delete).toHaveBeenCalled();
    });
  });
});
