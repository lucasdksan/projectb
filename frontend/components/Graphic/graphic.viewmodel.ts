import { useMemo } from "react";
import { ChartDataPoint, GraphicModelProps } from "./graphic.model";

const WEEK_DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
const MONTH_NAMES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function aggregateByWeek(contents: { createdAt: Date }[]): ChartDataPoint[] {
    const dayCount: Record<string, number> = Object.fromEntries(WEEK_DAYS.map(d => [d, 0]));
    contents.forEach(content => {
        const date = new Date(content.createdAt);
        const dayName = WEEK_DAYS[(date.getDay() + 6) % 7];
        dayCount[dayName]++;
    });
    return WEEK_DAYS.map(day => ({ name: day, v: dayCount[day] }));
}

function aggregateByMonth(contents: { createdAt: Date }[]): ChartDataPoint[] {
    const byMonth = new Map<string, { label: string; count: number }>();

    contents.forEach(content => {
        const date = new Date(content.createdAt);
        const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, "0")}`;
        const label = `${MONTH_NAMES[date.getMonth()]}/${date.getFullYear().toString().slice(2)}`;
        if (!byMonth.has(key)) {
            byMonth.set(key, { label, count: 0 });
        }
        byMonth.get(key)!.count++;
    });

    const sorted = [...byMonth.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    return sorted.map(([, { label, count }]) => ({ name: label, v: count }));
}

function aggregateByDay(contents: { createdAt: Date }[], daysBack: number = 30): ChartDataPoint[] {
    const dayCount: Record<string, number> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = daysBack - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        dayCount[key] = 0;
    }

    contents.forEach(content => {
        const date = new Date(content.createdAt);
        date.setHours(0, 0, 0, 0);
        const key = date.toISOString().slice(0, 10);
        if (key in dayCount) dayCount[key]++;
    });

    const sorted = Object.keys(dayCount).sort();
    return sorted.map(key => ({
        name: new Date(key).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
        v: dayCount[key],
        fullDate: key
    }));
}

export function useGraphicViewModel({ contents, granularity = "week" }: GraphicModelProps) {
    const chartData = useMemo((): ChartDataPoint[] => {
        if (!contents || contents.length === 0) return [];

        switch (granularity) {
            case "month":
                return aggregateByMonth(contents);
            case "day":
                return aggregateByDay(contents);
            case "week":
            default:
                return aggregateByWeek(contents);
        }
    }, [contents, granularity]);

    const hasData = useMemo(() => contents && contents.length > 0, [contents]);
    const totalContent = useMemo(() => contents?.length ?? 0, [contents]);

    return { chartData, hasData, totalContent };
}
