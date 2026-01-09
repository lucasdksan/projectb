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
    });
  });

  it("deve lançar erro quando alguma variável obrigatória não existir", async () => {
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
    process.env.DATABASE_URL = "postgres://user:pass@localhost:5432/db";
    process.env.NEXT_PUBLIC_NODE_ENV = "development";
    process.env.JWT_SECRET = "secret";

    process.env.MAIL_USER = "mail@test.com";
    process.env.MAIL_PASS = "mailpass";
    process.env.MAIL_HOST = "smtp.mail.com";

    await expect(() => import("../env")).rejects.toThrow(z.ZodError);
  });
});
