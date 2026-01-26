import { env } from "@/libs/env";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIIntegration } from "./intefaces";

const generativeAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = generativeAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const aiIntegration: AIIntegration = {
    singlePrompt: async (prompt: string) => {
        const result = await model.generateContent(prompt);

        return {
            data: result.response.text(),
        }
    },

    singlePromptWithImage: async (prompt: string, file: Blob) => {
        const imageBytes = await file.arrayBuffer();
        const imgBase64 = Buffer.from(imageBytes).toString("base64");

        const result = await model.generateContent([
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