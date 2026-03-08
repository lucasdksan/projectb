export default async function StorePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    
    return (
        <div>
            <h1>Store</h1>
        </div>
    )
}