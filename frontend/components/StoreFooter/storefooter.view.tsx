"use client";

export interface StoreFooterViewProps {
    storeName: string;
    logoUrl: string;
}

export default function StoreFooterView({
    storeName,
    logoUrl,
}: StoreFooterViewProps) {
    return (
        <footer className="bg-gray-50 border-t border-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <img
                            src={logoUrl}
                            alt="Logo"
                            className="w-6 h-6 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                        <span className="font-bold uppercase tracking-widest text-sm">
                            {storeName}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Sua melhor experiência de compra online. Qualidade e
                        estilo em cada detalhe.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-xs uppercase tracking-widest mb-4">
                        Links Úteis
                    </h4>
                    <ul className="space-y-2 text-xs text-gray-500">
                        <li>
                            <span className="hover:text-black cursor-pointer">
                                Sobre Nós
                            </span>
                        </li>
                        <li>
                            <span className="hover:text-black cursor-pointer">
                                Política de Privacidade
                            </span>
                        </li>
                        <li>
                            <span className="hover:text-black cursor-pointer">
                                Termos de Uso
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-200 text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                    © {new Date().getFullYear()} {storeName}. Todos os direitos
                    reservados.
                </p>
            </div>
        </footer>
    );
}
