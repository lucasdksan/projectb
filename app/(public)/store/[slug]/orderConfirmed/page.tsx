import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getStoreBySlugAction } from "../getstorebyslug.action";

export default async function OrderConfirmedPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const storeResult = await getStoreBySlugAction(slug);

    if (!storeResult.success || !storeResult.data) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <p>Loja não encontrada</p>
            </div>
        );
    }

    const { store } = storeResult.data;
    const primaryColor = store.config?.primaryColor ?? "#b8860b";

    return (
        <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
            <div
                className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto"
                style={{ backgroundColor: "rgb(220 252 231)", color: "rgb(22 163 74)" }}
            >
                <CheckCircle2 size={40} />
            </div>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Pedido Confirmado!</h1>
                <p className="text-gray-500">
                    Obrigado por comprar na {store.name}. Você receberá um e-mail
                    com os detalhes do seu pedido em breve.
                </p>
            </div>
            <Link
                href={`/store/${slug}`}
                className="inline-block w-full py-4 rounded-full font-bold text-white uppercase tracking-widest"
                style={{ backgroundColor: primaryColor }}
            >
                Voltar para a Home
            </Link>
        </div>
    );
}
