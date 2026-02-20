import StudioAreaView from "@/frontend/components/StudioArea/studioarea.view";

export default async function PostStudioPage() {
    return (
        <div className="flex flex-col h-[calc(100vh-80px)] animate-in fade-in duration-700">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Instant Post Studio</h2>
                <p className="text-gray-500">De fotos amadoras a campanhas profissionais em um clique.</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <StudioAreaView />
            </div>
        </div>
    )
}