import { Sparkles, AlertCircle, PackageCheck } from "lucide-react";
import { quantityAction } from "./quantity.action";
import { listAction } from "./list.action";
import { GraphicView } from "@/frontend/components/Graphic/graphic.view";
import { lastAction } from "./last.action";
import LastContentView from "@/frontend/components/LastContent/lastcontent.view";
import { getStoreAction } from "./getstore.action";
import AddProductModalView from "@/frontend/components/AddProductModal/addproductmodal.view";
import { quantityProductAction } from "./quantityproduct.action";

export default async function DashboardHomePage() {
    const quantityResult = await quantityAction();
    const listResult = await listAction();
    const lastResult = await lastAction();
    const storeResult = await getStoreAction();
    const quantityProductResult = await quantityProductAction();

    const quantity = quantityResult.success ? quantityResult.data.quantity : 0;
    const contents = listResult.success ? listResult.data.contents : [];
    const lastContent = lastResult.success ? lastResult.data.lastContent : [];
    const quantityProduct = quantityProductResult.success ? quantityProductResult.data.quantity : 0;

    const hasError = !quantityResult.success || !listResult.success || !lastResult.success;

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] animate-in fade-in duration-700">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Visão geral</h2>
                    <p className="text-gray-500">Acompanhe o desempenho de sua loja e conteúdos gerados.</p>
                </div>
                {storeResult.success && storeResult.data.store && (
                    <AddProductModalView />
                )}
            </header>

            {hasError && (
                <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle className="text-red-500" size={20} />
                    <p className="text-red-400 text-sm">
                        Alguns dados não puderam ser carregados. Tente recarregar a página.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#161616] border border-white/5 p-6 rounded-2xl hover:border-[#00ff41]/30 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-xl group-hover:text-[#00ff41] transition-colors">
                            <Sparkles size={24} />
                        </div>
                        <span className="text-xs font-bold text-[#00ff41] bg-[#00ff41]/10 px-2 py-1 rounded-full">Conteúdos Gerados</span>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium mb-1">Conteúdos Gerados</h3>
                    <p className="text-2xl font-bold text-white">{quantity}</p>
                </div>
                <div className="bg-[#161616] border border-white/5 p-6 rounded-2xl hover:border-[#00ff41]/30 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-xl group-hover:text-[#00ff41] transition-colors">
                            <PackageCheck size={24} />
                        </div>
                        <span className="text-xs font-bold text-[#00ff41] bg-[#00ff41]/10 px-2 py-1 rounded-full">Produtos Cadastrados</span>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium mb-1">Produtos Cadastrados</h3>
                    <p className="text-2xl font-bold text-white">{quantityProduct}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 items-start">
                <div className="lg:col-span-2 bg-[#161616] border border-white/5 p-8 rounded-2xl h-full">
                    <h3 className="text-lg font-bold text-white mb-6">Performance de Conteúdo</h3>
                    {contents.length > 0 ? (
                        <div className="h-[300px] w-full">
                            <GraphicView contents={contents} />
                        </div>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center">
                            <p className="text-gray-500 text-sm">Nenhum dado disponível para exibir</p>
                        </div>
                    )}
                </div>

                <div className="bg-[#161616] border border-white/5 p-8 rounded-2xl flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white">Atividade Recente</h3>
                        <div className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse"></div>
                    </div>
                    {lastContent.length > 0 ? (
                        <LastContentView lastContent={lastContent} />
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-gray-500 text-sm">Nenhuma atividade recente</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}