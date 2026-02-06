import { LastContentProps } from "./lastcontent.model";
import { Sparkles, Tag, ArrowRight, Inbox } from "lucide-react";

export default function LastContentView({ lastContent }: LastContentProps) {
    return (
        <div className="space-y-3 max-h-[300px] flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {lastContent && lastContent.length > 0 ? (
                lastContent.map((content, i) => (
                    <div
                        key={i}
                        className="group relative flex gap-4 items-start p-4 rounded-xl bg-white/[0.02] border border-white/0 hover:border-[#00ff41]/20 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer"
                    >
                        {i < lastContent.length - 1 && (
                            <div className="absolute left-[28px] top-[64px] w-[2px] h-[calc(100%)] bg-gradient-to-b from-white/10 to-transparent"></div>
                        )}

                        <div className="relative z-10 w-12 h-12 rounded-xl bg-gradient-to-br from-[#00ff41]/20 to-[#00ff41]/5 flex items-center justify-center text-[#00ff41] group-hover:scale-110 group-hover:from-[#00ff41]/30 group-hover:to-[#00ff41]/10 transition-all duration-300 flex-shrink-0">
                            <Sparkles className="w-5 h-5" />
                            <div className="absolute inset-0 rounded-xl bg-[#00ff41]/0 group-hover:bg-[#00ff41]/5 blur-xl transition-all duration-300"></div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-semibold mb-1.5 line-clamp-2 group-hover:text-[#00ff41]/90 transition-colors">
                                {content.headline}
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-white/5 px-2.5 py-1 rounded-full group-hover:bg-[#00ff41]/10 group-hover:text-[#00ff41] transition-colors">
                                    <Tag className="w-3 h-3" />
                                    {content.platform}
                                </span>
                            </div>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
                            <ArrowRight className="w-4 h-4 text-[#00ff41]" />
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-600 mb-4">
                        <Inbox className="w-8 h-8" />
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Nenhuma atividade recente</p>
                    <p className="text-xs text-gray-600 mt-1">Seus conteúdos aparecerão aqui</p>
                </div>
            )}
        </div>
    )
}