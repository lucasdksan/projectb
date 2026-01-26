import { env } from "@/libs/env";
import { del, put } from "@vercel/blob";

export const vercelBlobIntegration = {
    async upload(file: File): Promise<string> {
        const blob = await put(file.name, file, {
            access: "public",
            token: env.BLOB_READ_WRITE_TOKEN,
        });

        return blob.url;
    },

    async delete(url: string): Promise<void> {
        await del(url, {
            token: env.BLOB_READ_WRITE_TOKEN,
        });
    }
}