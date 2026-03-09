import CardStoreView from "@/frontend/components/CardStore/cardstore.view";
import { getStoreBySlugAction } from "./getstorebyslug.action";

export default async function StorePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const result = await getStoreBySlugAction(slug);
    const { success, data } = result;

    if (!success || !data) {
        return (
            <div>
                <h1>Erro ao buscar loja</h1>
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen flex flex-col items-center bg-white">
            <div className="w-full h-24" style={{ backgroundColor: data.store.config?.primaryColor }} />
            <div className="w-full max-w-md flex-1 pt-4 flex justify-center px-4">
                <CardStoreView
                    name={data.store.name}
                    email={data.store.email}
                    number={data.store.number}
                    description={data.store.description}
                    image={data.store.config?.logoUrl ?? ""}
                    primaryColor={data.store.config?.primaryColor}
                    secondaryColor={data.store.config?.secondaryColor}
                />
            </div>
        </div>
    )
}