import FormGenerateContentAI from "@/frontend/components/FormGenerateContentAI";

export default function DashboardContentAI() {
    return (
        <div className="w-full h-full p-6 flex flex-col gap-3">
            <div className="flex flex-col md:items-start justify-between">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Gerar Conteúdo com IA</h2>
                <p className="text-slate-500 mt-1">Crie textos persuasivos para seus canais de venda em segundos.</p>
            </div>
            <FormGenerateContentAI />
        </div>
    );
}