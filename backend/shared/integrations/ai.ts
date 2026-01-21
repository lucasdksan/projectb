import { env } from "@/libs/env";
import { GoogleGenerativeAI } from "@google/generative-ai";

const generativeAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export const generativeAIUtils = {
    model: generativeAI.getGenerativeModel({ model: "gemini-2.5-flash" }),

    singlePrompt: async function (prompt: string) {
        const _this = this;
        const result = await _this.model.generateContent(prompt);

        return {
            data: result.response.text(),
        }
    },

    singlePromptWithImage: async function (prompt: string, file: Blob) {
        const _this = this;

        const imageBytes = await file.arrayBuffer();
        const imgBase64 = Buffer.from(imageBytes).toString("base64");

        const result = await _this.model.generateContent([
            { text: prompt },
            {
                inlineData: {
                    mimeType: file.type,
                    data: imgBase64
                }
            }
        ]);

        return {
            data: result.response.text(),
        }
    }
}