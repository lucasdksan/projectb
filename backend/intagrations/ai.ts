import { env } from "@/libs/env";
import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { AIIntegration, ChatHistoryItem } from "./intefaces";

const generativeAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = generativeAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

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
    },

    chatWithContext: async (
        systemPrompt: string,
        history: ChatHistoryItem[],
        currentMessage: string,
        image?: Blob
    ) => {
        const chatHistory: Content[] = [
            { role: "user", parts: [{ text: systemPrompt }] },
            { role: "model", parts: [{ text: "Entendido. Estou pronto para ajudar." }] },
            ...history.map((msg) => ({
                role: msg.role as "user" | "model",
                parts: [{ text: msg.content }],
            })),
        ];

        const chat = model.startChat({ history: chatHistory });

        let result;
        if (image) {
            const imageBytes = await image.arrayBuffer();
            const imgBase64 = Buffer.from(imageBytes).toString("base64");

            result = await chat.sendMessage([
                { text: currentMessage },
                {
                    inlineData: {
                        mimeType: image.type,
                        data: imgBase64,
                    },
                },
            ]);
        } else {
            result = await chat.sendMessage(currentMessage);
        }

        return {
            data: result.response.text(),
        };
    },
}