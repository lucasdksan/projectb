export interface ChartDataPoint {
    name: string;
    v: number;
}

export interface ContentData {
    id: number;
    headline: string;
    description: string;
    cta: string;
    hashtags: string;
    platform: string;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
}

export interface GraphicModelProps {
    contents: ContentData[];
}
