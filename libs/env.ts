import z from "zod";
import "dotenv/config";

export const envSchema = z.object({
    NEXT_PUBLIC_APP_URL: z.string(),
    DATABASE_URL: z.string(),
    NEXT_PUBLIC_NODE_ENV: z.string(),
    JWT_SECRET: z.string(),
    MAIL_USER: z.string(),
    MAIL_PASS: z.string(),
    MAIL_HOST: z.string(),
    MAIL_PORT: z.string(),
    GEMINI_API_KEY: z.string(),
    INSTAGRAM_APP_ID: z.string(),
    INSTAGRAM_APP_KEY: z.string(),
    INSTAGRAM_APP_NAME: z.string(),
    INSTAGRAM_TOKEN: z.string(),
    BLOB_READ_WRITE_TOKEN: z.string(),
});

export const env = envSchema.parse(process.env);