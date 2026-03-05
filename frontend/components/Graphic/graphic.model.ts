export interface ChartDataPoint {
    name: string;
    v: number;
}

/** Modos de agregação do gráfico de conteúdos gerados */
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
    /** Granularidade do gráfico: semana (dias da semana), mês ou dia do mês */
    granularity?: ChartGranularity;
}
