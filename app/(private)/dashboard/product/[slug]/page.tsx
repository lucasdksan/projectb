interface DashboardProductDetailProps {
    params: Promise<{ slug: string }>;
}   

export default async function DashboardProductDetail(props: DashboardProductDetailProps) {
    const { slug } = await props.params;

    return (
        <div>
            <h1>Product Detail: {slug}</h1>
        </div>
    );
}