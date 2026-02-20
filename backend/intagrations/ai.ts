import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { AIIntegration, ChatHistoryItem } from "./intefaces";
import { env } from "@/libs/env";

const generativeAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = generativeAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const imageModel = generativeAI.getGenerativeModel({
    model: "gemini-2.0-flash-preview-image-generation",
});

export const aiIntegration: AIIntegration = {
    singlePrompt: async (prompt: string) => {
        const result = await model.generateContent(prompt);

        return {
            data: result.response.text(),
        };
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
        };
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
    generateReadyPost: async (
        headline: string,
        style: string,
        image: Blob,
        customContext?: string
    ) => {
        try {
            const imageArrayBuffer = await image.arrayBuffer();
            const imageBuffer = Buffer.from(imageArrayBuffer);

            const prompt = `Act as a world-class commercial photographer and graphic designer. 
      SOURCE PRODUCT: Use the product in the provided image.
      STYLE PRESET: ${style}.
      TEXT OVERLAY: "${headline}".
      ${customContext
                    ? `CUSTOM SCENE REQUIREMENT: ${customContext}.`
                    : "SCENE: Place the product in a premium studio environment."}
      
      DIRECTIONS:
      1. If a model is requested in the custom context, generate a realistic, high-fashion human model interacting with the product.
      2. Ensure the product from the original image is the focal point and seamlessly integrated.
      3. Apply cinematic lighting and high-end commercial retouching.
      4. Place the text "${headline}" using modern, bold typography that is legible and aesthetic.
      5. The final output must be a single, ready-to-post Instagram square graphic.
      `;

            const result = await imageModel.generateContent([
                {
                    inlineData: {
                        mimeType: image.type,
                        data: imageBuffer.toString("base64"),
                    },
                },
                {
                    text: prompt,
                },
            ]);

            const response = result.response;

            for (const part of response.candidates?.[0]?.content?.parts ?? []) {
                if (part.inlineData) {
                    const mimeType = part.inlineData.mimeType || "image/png";

                    return {
                        data: `data:${mimeType};base64,${part.inlineData.data}`,
                    };
                }
            }

            throw new Error("No image returned from Gemini");

        } catch (error) {
            console.error("generateReadyPost error:", error);
            throw error;
        }
    }
}