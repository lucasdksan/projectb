import Image from "next/image";
import Link from "next/link";
import { Zap, Play, Sparkles, TrendingUp, Layers } from "lucide-react";
import { FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Home() {
    return (
        <div className="min-h-screen bg-background text-white overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[accent]/5 blur-[120px] rounded-full"></div>
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-[20%] w-[60%] h-[30%] bg-[accent]/3 blur-[150px] rounded-full"></div>
            </div>

            <nav className="relative z-10 container mx-auto px-8 py-8 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                        <Zap className="w-5 h-5 text-black" />
                    </div>
                    <span className="hidden md:block text-xl font-bold tracking-tight">Projeto B</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                    <a href="#features" className="hover:text-white transition-colors">Recursos</a>
                    <a href="#ai" className="hover:text-white transition-colors">Tecnologia</a>
                    <a href="#pricing" className="hover:text-white transition-colors">Preços</a>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/auth/signin" className="text-sm font-bold px-6 py-2 hover:text-accent transition-colors">Entrar</Link>
                    <Link href="/auth/signup" className="bg-accent text-black text-sm font-bold px-6 py-3 rounded-full hover:bg-[#00e03a] transition-all shadow-lg shadow-accent/10">Começar Agora</Link>
                </div>
            </nav>

            <section className="relative z-10 container mx-auto px-8 pt-20 pb-32 text-center">
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-300">Inteligência Artificial de Próxima Geração</span>
                </div>
                <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    Gerencie sua loja com o <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-400">Poder da IA</span>
                </h1>
                <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
                    Automatize a criação de conteúdos, analise seu estoque em tempo real e impulsione suas vendas com o assistente inteligente mais avançado do mercado.
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-700 delay-300">
                    <Link href="/register" className="w-full md:w-auto bg-accent text-black text-lg font-bold px-10 py-5 rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-accent/20">
                        Teste Grátis por 14 dias
                    </Link>
                    <button className="w-full md:w-auto bg-white/5 border border-white/10 text-white text-lg font-bold px-10 py-5 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                        <Play className="w-4 h-4" />
                        Ver Demonstração
                    </button>
                </div>

                <div className="mt-24 relative animate-in fade-in zoom-in-95 duration-1000 delay-500">
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
                    <div className="bg-[#111] border border-white/10 rounded-3xl p-4 shadow-3xl shadow-accent/5 overflow-hidden">
                        <Image
                            src="/banner-hero.png"
                            alt="Dashboard Preview"
                            width={1000}
                            height={1000}
                            className="w-full h-auto rounded-2xl opacity-80 grayscale-[0.2]"
                        />
                    </div>
                </div>
            </section>

            <section id="features" className="relative z-10 container mx-auto px-8 py-32 border-t border-white/5">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Tudo o que você precisa</h2>
                    <p className="text-gray-500 max-w-xl mx-auto">Uma plataforma integrada desenhada para alta performance e resultados reais.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-[#161616] border border-white/5 p-10 rounded-3xl hover:border-accent/30 transition-all group">
                        <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent text-2xl mb-8 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Escrita Criativa IA</h3>
                        <p className="text-gray-500 leading-relaxed">Gere legendas, descrições e roteiros de anúncios em segundos a partir de fotos dos seus produtos.</p>
                    </div>
                    <div className="bg-[#161616] border border-white/5 p-10 rounded-3xl hover:border-accent/30 transition-all group">
                        <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent text-2xl mb-8 group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Análise Preditiva</h3>
                        <p className="text-gray-500 leading-relaxed">Identifique tendências de mercado e otimize seu estoque antes mesmo da demanda aumentar.</p>
                    </div>
                    <div className="bg-[#161616] border border-white/5 p-10 rounded-3xl hover:border-accent/30 transition-all group">
                        <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent text-2xl mb-8 group-hover:scale-110 transition-transform">
                            <Layers className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Gestão Omnichannel</h3>
                        <p className="text-gray-500 leading-relaxed">Controle todos os seus canais de venda em um único dashboard intuitivo e poderoso.</p>
                    </div>
                </div>
            </section>

            <section className="bg-white/[0.02] py-24 border-y border-white/5">
                <div className="container mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    <div>
                        <p className="text-4xl font-black text-accent mb-2">+10k</p>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Usuários Ativos</p>
                    </div>
                    <div>
                        <p className="text-4xl font-black text-accent mb-2">98%</p>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Satisfação</p>
                    </div>
                    <div>
                        <p className="text-4xl font-black text-accent mb-2">5M+</p>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Textos Gerados</p>
                    </div>
                    <div>
                        <p className="text-4xl font-black text-accent mb-2">24/7</p>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Suporte IA</p>
                    </div>
                </div>
            </section>

            <footer className="container mx-auto px-8 py-20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                            <Zap className="w-3 h-3 text-black" />
                        </div>
                        <span className="text-lg font-bold">Projeto B</span>
                    </div>
                    <p className="text-gray-500 text-sm">© 2026 Projeto B AI. Todos os direitos reservados.</p>
                    <div className="flex gap-6 text-gray-500 text-xl">
                        <FaInstagram className="w-5 h-5 hover:text-accent cursor-pointer transition-colors" />
                        <FaTwitter className="w-5 h-5 hover:text-accent cursor-pointer transition-colors" />
                        <FaLinkedin className="w-5 h-5 hover:text-accent cursor-pointer transition-colors" />
                    </div>
                </div>
            </footer>
        </div>
    )
}