export default async function ProductPage({
    params,
}: {
    params: Promise<{ productSlug: string }>;
}) {
    const { productSlug } = await params;
    
    return (
        <div>
            <h1>Product Page</h1>
        </div>
    )
}
