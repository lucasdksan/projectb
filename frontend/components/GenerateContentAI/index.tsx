import CardIA from "./CardIA";

export default function GenerateContentAI() {
    return (
        <div className="bg-surface rounded-xl p-6 shadow-sm border border-[#e5e8e5] sticky top-24 max-h-[582px]">
            <div className="flex items-center gap-3 mb-2">
                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">Chat</span>
                </div>
                <h3 className="text-xl font-bold text-text-main">Gerar Conteúdo</h3>
            </div>
            <p className="text-sm text-text-secondary mb-6 pl-11">Crie textos persuasivos para seus canais de venda em segundos.</p>
            <div className="flex flex-col gap-4">
                <CardIA text="Legenda para post com hashtags virais." title="Instagram" btnText="Gerar Post" colorIcon="bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400" />
                <CardIA text="Mensagem curta para lista de contatos." title="WhatsApp" btnText="Gerar Mensagem" colorIcon="bg-[#25D366]" />
                <CardIA text="Descrição técnica otimizada para SEO." title="Shopee" btnText="Otimizar Texto" colorIcon="bg-[#EE4D2D]" />
            </div>
        </div>
    );
}