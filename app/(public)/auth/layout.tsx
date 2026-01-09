import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Área de Login",
    description: "área do sistema de login do site.",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="w-full h-full">
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]"></div>
                <div className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px]"></div>
            </div>
            {children}
        </main>
    )
}