import { product } from "@/backend/modules/product/product.types";

interface ProductCardProps {
    product: product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e5e8e5]">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/2 flex flex-col gap-3">
                        <div className="w-full aspect-square bg-neutral-100 rounded-xl overflow-hidden relative group">
                            <div className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-105"></div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {/* Área das imagens DOTS */}
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col gap-6">
                        <div>
                            <div className="flex justify-between mb-2 items-center">
                                { product.isActive ? (
                                    <span className="inline-block px-2 py-1 rounded bg-[#e8f5e9] text-[#2e7d32] text-xs font-bold uppercase tracking-wider">
                                        Ativo
                                    </span>
                                ) : (
                                    <span className="inline-block px-2 py-1 rounded bg-[#ffebee] text-[#d32f2f] text-xs font-bold uppercase tracking-wider">
                                        Inativo
                                    </span>
                                )}
                                <span className="text-text-secondary text-xs">{product.createdAt.toLocaleDateString("pt-BR")}</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-text-mainleading-tight mb-2">{product.name}</h2>
                            <span className="text-3xl font-black text-text-main tracking-tight">{product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                            <p className="text-sm text-text-secondary mt-1">{product.category}</p>
                        </div>
                        <div className="border-t border-[#e5e8e5] dark:border-[#2a3e2a] pt-4">
                            <h3 className="text-sm font-bold text-text-main dark:text-white uppercase mb-2">Descrição</h3>
                            <p className="text-text-secondary text-sm leading-relaxed">{product.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#f8faf8] p-3 rounded-lg border border-[#e5e8e5]">
                                <p className="text-text-secondary text-xs font-medium mb-1">Estoque</p>
                                <span className="text-lg font-bold text-text-main">{product.stock}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-[#e5e8e5]">
                    <h3 className="text-lg font-bold text-text-main mb-4">Especificações Técnicas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                        {product.attributes?.map((attribute) => (
                            <div key={attribute.kindof} className="flex justify-between items-center py-2 border-b border-dashed border-[#e5e8e5]">
                                <span className="text-text-secondary text-sm">{attribute.kindof}</span>
                                <span className="text-text-main text-sm font-medium">{attribute.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}