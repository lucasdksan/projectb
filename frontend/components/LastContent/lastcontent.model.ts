export interface LastContentProps {
    lastContent: {
        headline: string;
        description: string;
        cta: string;
        hashtags: string;
        platform: string;
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
    }[];
}