import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center gap-4">
            <h1 className="text-4xl font-bold">404 - Página não encontrada</h1>
            <p className="text-gray-500">A página que você está procurando não existe.</p>
            <Link href="/" className="text-accent font-bold hover:underline">Voltar para a página inicial</Link>
        </div>
    )
}