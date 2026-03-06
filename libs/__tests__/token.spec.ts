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
    it("deve configurar access e refresh token nos cookies com secure true", async () => {
      const mockCookieStore = {
        set: vi.fn(),
      };

      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any);

      const tokenIntoCookies = (await import("../token")).default;
      await tokenIntoCookies.set("my-jwt-token", "my-refresh-token", true);

      expect(mockCookieStore.set).toHaveBeenCalledTimes(2);
      expect(mockCookieStore.set).toHaveBeenNthCalledWith(1, {
        name: "token",
        value: "my-jwt-token",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 15,
      });
      expect(mockCookieStore.set).toHaveBeenNthCalledWith(2, {
        name: "refreshToken",
        value: "my-refresh-token",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    });

    it("deve configurar os tokens nos cookies com secure false", async () => {
      const mockCookieStore = {
        set: vi.fn(),
      };

      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any);

      const tokenIntoCookies = (await import("../token")).default;
      await tokenIntoCookies.set("my-jwt-token", "my-refresh-token", false);

      expect(mockCookieStore.set).toHaveBeenNthCalledWith(1, expect.objectContaining({
        secure: false,
      }));
    });

    it("deve configurar cookies com httpOnly e sameSite strict", async () => {
      const mockCookieStore = {
        set: vi.fn(),
      };

      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any);

      const tokenIntoCookies = (await import("../token")).default;
      await tokenIntoCookies.set("test-token", "test-refresh", true);

      const callArgs = mockCookieStore.set.mock.calls[0][0];
      expect(callArgs.httpOnly).toBe(true);
      expect(callArgs.sameSite).toBe("strict");
      expect(callArgs.path).toBe("/");
    });
  });

  describe("setAccessOnly", () => {
    it("deve configurar apenas o access token (para update de perfil)", async () => {
      const mockCookieStore = {
        set: vi.fn(),
      };

      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any);

      const tokenIntoCookies = (await import("../token")).default;
      await tokenIntoCookies.setAccessOnly("new-access-token", true);

      expect(mockCookieStore.set).toHaveBeenCalledTimes(1);
      expect(mockCookieStore.set).toHaveBeenCalledWith({
        name: "token",
        value: "new-access-token",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 15,
      });
    });
  });

  describe("deleteAll", () => {
    it("deve deletar token e refreshToken", async () => {
      const mockCookieStore = {
        delete: vi.fn(),
      };

      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any);

      const tokenIntoCookies = (await import("../token")).default;
      await tokenIntoCookies.deleteAll();

      expect(mockCookieStore.delete).toHaveBeenCalledTimes(2);
      expect(mockCookieStore.delete).toHaveBeenNthCalledWith(1, { name: "token" });
      expect(mockCookieStore.delete).toHaveBeenNthCalledWith(2, { name: "refreshToken" });
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
