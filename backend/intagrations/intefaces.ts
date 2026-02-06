export type ChatHistoryItem = {
    role: "user" | "model";
    content: string;
};

export interface AIIntegration {
    singlePrompt: (prompt: string) => Promise<{ data: string }>;
    singlePromptWithImage: (prompt: string, image: Blob) => Promise<{ data: string }>;
    chatWithContext: (
        systemPrompt: string,
        history: ChatHistoryItem[],
        currentMessage: string,
        image?: Blob
    ) => Promise<{ data: string }>;
};

export interface VercelIntegration {
    blob: {
        upload: (file: File) => Promise<string>;
        delete: (url: string) => Promise<void>;
    };
}