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
        <main className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full"></div>
            <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full"></div>
  
            {children}
        </main>
    )
}