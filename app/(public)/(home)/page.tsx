export default function Home() {
    return (
        <>
            <header className="border-b border-border-light bg-surface">
                <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-text-main">
                        GreenProduct
                    </h1>

                    <nav className="hidden md:flex gap-6 text-text-secondary">
                        <a href="#" className="hover:text-primary">Produto</a>
                        <a href="#" className="hover:text-primary">Benefícios</a>
                        <a href="#" className="hover:text-primary">Contato</a>
                    </nav>
                </div>
            </header>

            <section className="mx-auto max-w-7xl px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-text-main leading-tight">
                        O produto que transforma
                        <span className="text-primary">sua rotina</span>
                    </h2>

                    <p className="mt-6 text-lg text-text-secondary">
                        Uma solução moderna, sustentável e pensada para facilitar o seu dia a dia
                        com tecnologia e eficiência.
                    </p>

                    <div className="mt-8 flex gap-4">
                        <button className="btn-primary px-6 py-3 rounded-lg font-semibold transition">
                            Comprar agora
                        </button>

                        <button
                            className="px-6 py-3 rounded-lg border border-border-light text-text-main hover:bg-surface"
                        >
                            Saiba mais
                        </button>
                    </div>
                </div>

                <div className="flex justify-center">
                    <div
                        className="w-full max-w-sm h-80 rounded-2xl bg-surface border border-border-light flex items-center justify-center text-text-muted"
                    >
                        Imagem do Produto
                    </div>
                </div>
            </section>

            <section className="bg-surface border-t border-border-light">
                <div className="mx-auto max-w-7xl px-6 py-16">
                    <h3 className="text-3xl font-bold text-text-main text-center">
                        Por que escolher este produto?
                    </h3>

                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        <div className="rounded-xl border border-border-light p-6">
                            <h4 className="text-xl font-semibold text-text-main">
                                Sustentável
                            </h4>
                            <p className="mt-2 text-text-secondary">
                                Desenvolvido com foco em impacto ambiental reduzido.
                            </p>
                        </div>

                        <div className="rounded-xl border border-border-light p-6">
                            <h4 className="text-xl font-semibold text-text-main">
                                Alta performance
                            </h4>
                            <p className="mt-2 text-text-secondary">
                                Resultados consistentes e confiáveis no uso diário.
                            </p>
                        </div>

                        <div className="rounded-xl border border-border-light p-6">
                            <h4 className="text-xl font-semibold text-text-main">
                                Fácil de usar
                            </h4>
                            <p className="mt-2 text-text-secondary">
                                Design intuitivo pensado para qualquer pessoa.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-20 text-center">
                <h3 className="text-3xl font-bold text-text-main">
                    Pronto para começar?
                </h3>

                <p className="mt-4 text-text-secondary">
                    Garanta agora o produto que vai mudar sua experiência.
                </p>

                <button className="btn-primary mt-8 px-8 py-4 rounded-xl text-lg font-semibold">
                    Comprar agora
                </button>
            </section>

            <footer className="border-t border-border-light bg-surface">
                <div className="mx-auto max-w-7xl px-6 py-6 text-center text-text-muted">
                    © 2026 GreenProduct. Todos os direitos reservados.
                </div>
            </footer>
        </>
    );
}