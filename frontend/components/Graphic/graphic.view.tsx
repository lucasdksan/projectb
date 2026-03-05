"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useGraphicViewModel } from './graphic.viewmodel';
import { ChartGranularity, GRANULARITY_OPTIONS, GraphicModelProps } from './graphic.model';

export function GraphicView({ contents }: GraphicModelProps) {
    const [granularity, setGranularity] = useState<ChartGranularity>("week");
    const { chartData, hasData } = useGraphicViewModel({ contents, granularity });

    if (!hasData) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <p className="text-gray-500 text-sm">Nenhum conteúdo gerado ainda</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-[200px] h-full flex flex-col gap-4">
            <div className="flex gap-2 flex-wrap">
                {GRANULARITY_OPTIONS.map(({ value, label }) => (
                    <button
                        key={value}
                        onClick={() => setGranularity(value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                            granularity === value
                                ? "bg-[#00ff41] text-black border-[#00ff41]"
                                : "bg-white/5 text-gray-400 border-white/10 hover:border-[#00ff41]/50"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                <AreaChart data={chartData}>
                <defs>
                    <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ff41" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00ff41" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis 
                    dataKey="name" 
                    stroke="#555" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    interval={granularity === "day" ? "preserveStartEnd" : 0}
                    padding={{ left: 10, right: 10 }}
                />
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333', 
                        borderRadius: '8px' 
                    }}
                    itemStyle={{ color: '#00ff41' }}
                    labelStyle={{ color: '#fff' }}
                />
                <Area 
                    type="monotone" 
                    dataKey="v" 
                    stroke="#00ff41" 
                    fillOpacity={1} 
                    fill="url(#colorV)" 
                    strokeWidth={2}
                />
            </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
