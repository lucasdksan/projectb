import { useMemo } from "react";
import { GraphicModelProps } from "./graphic.model";

export function useGraphicViewModel({ contents }: GraphicModelProps) {
    const chartData = useMemo(() => {
        if (!contents || contents.length === 0) {
            return [];
        }

        const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
        const dayCount: { [key: string]: number } = {
            "Dom": 0,
            "Seg": 0,
            "Ter": 0,
            "Qua": 0,
            "Qui": 0,
            "Sex": 0,
            "Sab": 0
        };

        contents.forEach(content => {
            const date = new Date(content.createdAt);
            const dayIndex = date.getDay();
            const dayName = weekDays[dayIndex];
            dayCount[dayName]++;
        });

        return ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"].map(day => ({
            name: day,
            v: dayCount[day]
        }));
    }, [contents]);

    const hasData = useMemo(() => {
        return contents && contents.length > 0;
    }, [contents]);

    const totalContent = useMemo(() => {
        return contents?.length || 0;
    }, [contents]);

    return {
        chartData,
        hasData,
        totalContent,
    };
}
