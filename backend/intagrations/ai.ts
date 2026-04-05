import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { AIIntegration, ChatHistoryItem } from "./intefaces";
import { env } from "@/libs/env";

const generativeAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = generativeAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const imageModel = generativeAI.getGenerativeModel({
    model: "gemini-3.1-flash-image-preview",
});

const MAX_RETRIES = 3;
const DEFAULT_RETRY_DELAY_MS = 4000;

function isRateLimitError(error: unknown): boolean {
    const msg = error instanceof Error ? error.message : String(error);
    return msg.includes("429") || msg.includes("Too Many Requests") || msg.includes("quota");
}

function getRetryDelayMs(error: unknown): number {
    const msg = error instanceof Error ? error.message : String(error);
    const match = msg.match(/retry in (\d+\.?\d*)s/i);
    if (match) {
        return Math.ceil(parseFloat(match[1]) * 1000);
    }
    const err = error as { errorDetails?: Array<{ retryDelay?: string }> };
    const retryInfo = err?.errorDetails?.find?.((d) => "retryDelay" in d);
    if (retryInfo?.retryDelay) {
        const str = retryInfo.retryDelay;
        const seconds = parseInt(str.replace(/[^\d]/g, ""), 10) || 3;
        return seconds * 1000;
    }
    return DEFAULT_RETRY_DELAY_MS;
}

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: unknown;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            if (attempt < MAX_RETRIES - 1 && isRateLimitError(error)) {
                const delay = getRetryDelayMs(error);
                await new Promise((r) => setTimeout(r, delay));
            } else {
                throw error;
            }
        }
    }
    throw lastError;
}

export const aiIntegration: AIIntegration = {
    singlePrompt: async (prompt: string) => {
        return withRetry(async () => {
            const result = await model.generateContent(prompt);
            return { data: result.response.text() };
        });
    },

    singlePromptWithImage: async (prompt: string, file: Blob) => {
        return withRetry(async () => {
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
        });
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
    },

    generatePostStudioChatPrompt: async (context: string, image: Blob) => {
        return withRetry(async () => {
            const imageBytes = await image.arrayBuffer();
            const imgBase64 = Buffer.from(imageBytes).toString("base64");

            const instruction = `You are an expert prompt engineer for image generation (Midjourney, DALL·E, Gemini, etc.).

The user attached a product/source image and answered questions in Portuguese. Your task:
1. Analyze the image briefly (subject, framing) only to enrich the text prompt.
2. Produce ONE detailed, professional prompt in English that reflects ALL context below.
3. If the user asks to replace mannequins with real people, or to show models with specific looks or origins, the English prompt MUST explicitly require full human models in a full scene wearing the garments — not flat lays, not clothing-only shots, unless they asked for that.

CONTEXT (Portuguese):
${context}

Output format (Markdown):
- Use a short title in Portuguese: "## Prompt sugerido"
- Then a single fenced code block containing the full English prompt for image generation (no extra commentary inside the block).
- Optionally add one short paragraph in Portuguese after the block with tips for the user.`;

            const result = await model.generateContent([
                { text: instruction },
                {
                    inlineData: {
                        mimeType: image.type,
                        data: imgBase64,
                    },
                },
            ]);

            return { data: result.response.text() };
        });
    },

    generatePostStudioChatImage: async (image: Blob, context: string) => {
        try {
            const imageArrayBuffer = await image.arrayBuffer();
            const imageBuffer = Buffer.from(imageArrayBuffer);

            const prompt = `Act as a world-class commercial photographer and graphic designer.

REFERENCE IMAGE: The attached image is a reference only (e.g. mannequins, flat lay, or styled shot). Do not default to "clothing only" or isolated garments unless the user explicitly asked for that.

USER CREATIVE DIRECTION (Portuguese — this overrides generic rules; follow it literally):
${context}

PRIORITY RULES:
1. **Transformations first:** If the user asks to replace mannequins with real people, or to show people instead of dummies, you MUST render **photorealistic full human models** in an appropriate environment (boutique, street, studio, etc.), wearing the same type of garments as in the reference. **Do not** output only the clothes on a hanger, flat lay, or ghost mannequin unless the user asked for product-only.
2. **Demographics / casting:** If the user names types of people (e.g. regional or ethnic descriptors), depict **respectful, natural-looking** diverse models matching that brief in a normal fashion/editorial context. Show **faces and bodies** as in a real campaign — not faceless crops unless the brief implies it.
3. **Garments:** Reproduce the outfit style, colors, and fit from the reference on the models; the clothing must be clearly worn by people, not floating alone.
4. **Composition:** Apply cinematic lighting and high-end commercial retouching. Respect aspect ratio, mood, and style from the context.
5. Output **one** polished image suitable for social media — a full scene with people when the brief asks for people.`;

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
            console.error("generatePostStudioChatImage error:", error);
            throw error;
        }
    },
}