import { describe, it, expect, vi } from "vitest";
import { cookies } from "next/headers";
import tokenIntoCookies from "../token";

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

describe("tokenIntoCookies", () => {
    it("deve setar o cookie corretamente", async () => {
        const setMock = vi.fn();

        (cookies as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            set: setMock,
        });

        await tokenIntoCookies.set("meu-token", true);

        expect(setMock).toHaveBeenCalledWith({
            name: "token",
            value: "meu-token",
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });
    });

    it("deve deletar o cookie corretamente", async () => {
        const deleteMock = vi.fn();

        (cookies as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            delete: deleteMock,
        });

        await tokenIntoCookies.delete("token");

        expect(deleteMock).toHaveBeenCalledWith({
            name: "token",
        });
    });
});
