export interface AIIntegration {
    singlePrompt: (prompt: string) => Promise<{ data: string }>;
    singlePromptWithImage: (prompt: string, image: Blob) => Promise<{ data: string }>;
};

export interface InstagramIntegration {
    publishToInstagram: (url: string, caption: string, IG_ID: string) => Promise<{ success: boolean, message: string }>;
};

export interface VercelIntegration {
    blob: {
        upload: (file: File) => Promise<string>;
        delete: (url: string) => Promise<void>;
    };
}