import { ArrowLeftIcon } from "lucide-react";
import { getProductAction } from "./getproduct.action";
import Link from "next/link";
import GenerateAddsView from "@/frontend/components/GenerateAdds/generateadds.view";

export default async function ProductPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const result = await getProductAction(Number(slug));
    const { success, data } = result;

    if (!success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
                <div className="w-16 h-16 border-4 border-[#00ff41]/20 border-t-[#00ff41] rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Buscando detalhes do produto...</p>
            </div>
        )
    }
    
    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
            <header className="flex items-center justify-between">
                <Link className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group" href="/dashboard/products">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
                        <ArrowLeftIcon className="w-4 h-4" />
                    </div>
                    <span className="font-bold uppercase tracking-widest text-[10px]">Voltar para Lista</span>
                </Link>

                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-sm hover:bg-white/10 transition-all">
                        Editar Produto
                    </button>
                    <GenerateAddsView
                            name={data.name ?? ""}
                            description={data.description ?? ""}
                            price={data.price}
                            stock={data.stock}
                            productImages={data.images}
                        />
                </div>
            </header>
            <main className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <section className="space-y-6">
                    <div className="aspect-[4/5] bg-white/5 rounded-[3rem] overflow-hidden border border-white/5 relative group">
                        <img
                            src={data.images[0].url}
                            alt={data.name}
                            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
                            referrerPolicy="no-referrer"
                        />
                        {data.stock > 0 && (
                            <div className="absolute top-8 right-8 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                <span className="text-[10px] font-black text-[#00ff41] uppercase tracking-widest">Em Estoque</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        {data.images.map((image, i) => (
                            <div key={i} className="aspect-square bg-white/5 rounded-2xl overflow-hidden border border-white/5 cursor-pointer hover:border-[#00ff41]/30 transition-all">
                                <img
                                    src={image.url}
                                    alt={`${data.name} view ${i}`}
                                    className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                                    referrerPolicy="no-referrer"
                                />
                            </div>
                        ))}
                    </div>
                </section>
                <section className="space-y-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
                                ID: {data.id}
                            </span>
                        </div>
                        <h1 className="text-6xl font-black text-white tracking-tighter leading-none">
                            {data.name}
                        </h1>
                        <p className="text-2xl font-mono text-[#00ff41]">
                            R$ {data.price.toFixed(2)}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Descrição do Produto</h3>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            {data.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                        <div>
                            <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Quantidade em Estoque</h4>
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-bold text-white">{data.stock}</span>
                                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#00ff41]"
                                        style={{ width: `${Math.min(data.stock * 2, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Status da Loja</h4>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#00ff41] rounded-full animate-pulse"></div>
                                <span className="text-white font-bold">Publicado</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#161616] border border-[#00ff41]/10 p-8 rounded-[2.5rem] space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff41]/5 blur-3xl rounded-full"></div>
                        <div className="flex items-center gap-3">
                            <i className="fa-solid fa-wand-magic-sparkles text-[#00ff41]"></i>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Sugestão da IA</h3>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed italic">
                            "Este produto tem alta demanda no momento. Recomendamos criar um carrossel focado na exclusividade e no conforto para aumentar as vendas em 15% nesta semana."
                        </p>
                        <button className="text-[10px] font-black text-[#00ff41] uppercase tracking-widest hover:underline">
                            Ver análise completa de tendências →
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}