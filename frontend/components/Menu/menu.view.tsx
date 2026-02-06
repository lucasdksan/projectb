"use client";

import Link from "next/link";
import { MenuAreaProps, MenuProps, activeStyle, menuItems, normalStyle } from "./menu.model";
import { useMenuViewModel } from "./menu.viewmodel";
import { logoutAction } from "@/app/(public)/auth/logout/logout.action";
import { LogOut, Zap } from "lucide-react";

function MenuArea({ profile, isActive }: MenuAreaProps) {
    return (
        <>
            <nav className="flex-1 mt-4">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`flex items-center gap-4 px-8 py-4 ${isActive(item.path) ? activeStyle : normalStyle}`}
                    >
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>
            <div className="p-6 border-t border-white/5">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-emerald-400 flex items-center justify-center font-bold text-black">
                        {profile.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate">{profile.name}</p>
                        <p className="text-xs text-gray-500 truncate">{profile.email}</p>
                    </div>
                </div>
                <form action={logoutAction}>
                    <button type="submit" className="flex items-center gap-4 px-2 py-2 text-red-400 hover:text-red-300 transition-colors">
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Sair</span>
                    </button>
                </form>
            </div>
        </>
    )
}

export default function MenuView({ email, name }: MenuProps) {
    const viewModel = useMenuViewModel();

    if (!viewModel) return null;

    const { stateMenu, setStateMenu, isActive } = viewModel;

    return (
        <>
            <div
                className={`
                fixed inset-0 bg-black/50 z-40 lg:hidden
                transition-opacity duration-300 ease-in-out
                ${stateMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}
                onClick={() => setStateMenu(false)}
                aria-hidden="true"
            />
            <aside
                className={`
                w-64 bg-[#0d0d0d] h-screen fixed lg:static left-0 top-0 flex flex-col border-r border-white/5
                max-w-[85vw] lg:max-w-none
                bg-surface
                shadow-xl z-50
                transform lg:transform-none transition-transform duration-300 ease-in-out
                ${stateMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
            >
                <div className="p-8">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                            <Zap className="w-4 h-4 text-black" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Projeto B</h1>
                    </Link>
                </div>
                <MenuArea profile={{ email, name }} isActive={isActive} />
            </aside>
        </>
    )
}