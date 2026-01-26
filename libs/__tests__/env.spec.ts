import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import z from "zod";

const ORIGINAL_ENV = process.env;

describe("envSchema", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("deve validar e retornar as variáveis de ambiente quando todas existirem", async () => {
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
    process.env.DATABASE_URL = "postgres://user:pass@localhost:5432/db";
    process.env.NEXT_PUBLIC_NODE_ENV = "development";
    process.env.JWT_SECRET = "secret";

    process.env.MAIL_USER = "mail@test.com";
    process.env.MAIL_PASS = "mailpass";
    process.env.MAIL_HOST = "smtp.mail.com";
    process.env.MAIL_PORT = "587";
    process.env.GEMINI_API_KEY = "gemini-api-key";
    process.env.INSTAGRAM_APP_ID = "1426682708921324";
    process.env.INSTAGRAM_APP_KEY = "e0adb96c8ae16b0ff5a722b8ea0ec69c";
    process.env.INSTAGRAM_APP_NAME = "test";
    process.env.INSTAGRAM_TOKEN = "instagram-token";
    process.env.BLOB_READ_WRITE_TOKEN = "blob-read-write-token";

    const { env } = await import("../env");

    expect(env).toEqual({
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      DATABASE_URL: "postgres://user:pass@localhost:5432/db",
      NEXT_PUBLIC_NODE_ENV: "development",
      JWT_SECRET: "secret",

      MAIL_USER: "mail@test.com",
      MAIL_PASS: "mailpass",
      MAIL_HOST: "smtp.mail.com",
      MAIL_PORT: "587",
      GEMINI_API_KEY: "gemini-api-key",
      INSTAGRAM_APP_ID: "1426682708921324",
      INSTAGRAM_APP_KEY: "e0adb96c8ae16b0ff5a722b8ea0ec69c",
      INSTAGRAM_APP_NAME: "test",
      INSTAGRAM_TOKEN: "instagram-token",
      BLOB_READ_WRITE_TOKEN: "blob-read-write-token",
    });
  });

  it("deve lançar erro quando alguma variável obrigatória não existir", async () => {
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
    process.env.DATABASE_URL = "postgres://user:pass@localhost:5432/db";
    process.env.NEXT_PUBLIC_NODE_ENV = "development";
    process.env.JWT_SECRET = "secret";
    process.env.BLOB_READ_WRITE_TOKEN = "blob-read-write-token";

    process.env.MAIL_USER = "mail@test.com";
    process.env.MAIL_PASS = "mailpass";
    process.env.MAIL_HOST = "smtp.mail.com";
    process.env.GEMINI_API_KEY = "gemini-api-key";
    process.env.INSTAGRAM_APP_ID = "1426682708921324";
    process.env.INSTAGRAM_APP_KEY = "e0adb96c8ae16b0ff5a722b8ea0ec69c";
    process.env.INSTAGRAM_APP_NAME = "test";
    process.env.INSTAGRAM_TOKEN = "instagram-token";
    process.env.BLOB_READ_WRITE_TOKEN = "blob-read-write-token";
    await expect(() => import("../env")).rejects.toThrow(z.ZodError);
  });
});
