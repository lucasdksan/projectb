"use client";

import { useEffect } from "react";
import MenuArea from "./MenuArea";
import { useIsMobile } from "@/frontend/hooks/useIsMobile";
import { useNavigationMenu } from "@/frontend/hooks/useNavigationMenu";

interface NavigationMenuProps {
    email: string;
    name: string;
}

export default function NavigationMenu({ email, name }: NavigationMenuProps){
    const isMobile = useIsMobile();
    const { stateMenu, setStateMenu } = useNavigationMenu();
    
    useEffect(()=>{
        // Em desktop, o menu sempre fica visível
        if (!isMobile) {
            setStateMenu(true);
        } else {
            // Em mobile, o menu inicia fechado
            setStateMenu(false);
        }
    }, [isMobile, setStateMenu]);

    // Prevenir scroll do body quando drawer estiver aberto
    useEffect(() => {
        if (!isMobile) return;

        if (stateMenu) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobile, stateMenu]);

    if (!isMobile) {
        return (
            <aside className="hidden lg:block bg-surface w-80 max-w-[85vw]">
               <MenuArea profile={{ email, name }} />
            </aside>
        );
    }

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
                    fixed top-0 left-0 h-full w-80 max-w-[85vw] 
                    bg-surface
                    shadow-xl z-50 lg:hidden
                    transform transition-transform duration-300 ease-in-out
                    ${stateMenu ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <MenuArea profile={{ email, name }} />
            </aside>
        </>
    );
}