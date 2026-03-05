export interface ChartDataPoint {
    name: string;
    v: number;
}

export type ChartGranularity = "week" | "month" | "day";

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
    granularity?: ChartGranularity;
}

export const GRANULARITY_OPTIONS: { value: ChartGranularity; label: string }[] = [
    { value: "week", label: "Dias da semana" },
    { value: "month", label: "Por mês" },
    { value: "day", label: "Por dia (30d)" },
];