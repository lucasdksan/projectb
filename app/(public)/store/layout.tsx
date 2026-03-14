import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Loja virtual",
    description: "área do sistema de loja virtual do site.",
};

export default function StoreLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {children}
        </>
    )
}