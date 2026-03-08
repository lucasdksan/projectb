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

    console.log(data);
    
    return (
        <div className="w-full h-full flex flex-col">
            <div className="w-full h-16" style={{ backgroundColor: data.store.config?.primaryColor }}>

            </div>
            <div className="w-full h-screen mx-auto min-h-screen flex flex-col bg-white flex-1">

            </div>
        </div>
    )
}