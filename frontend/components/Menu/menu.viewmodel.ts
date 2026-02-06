import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/frontend/hooks/useIsMobile";
import { useSidebar } from "@/frontend/hooks/useSidebar";

export function useMenuViewModel() {
    const isMobile = useIsMobile();
    const sidebar = useSidebar();
    const pathname = usePathname();

    if (!sidebar) return null;

    const { stateMenu, setStateMenu } = sidebar;
    
    useEffect(()=>{
        if (!isMobile) {
            setStateMenu(true);
        } else {
            setStateMenu(false);
        }
    }, [isMobile, setStateMenu]);

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

    function isActive(path: string) {
        return path === pathname;
    }

    return {
        isMobile,
        stateMenu,
        setStateMenu,
        isActive,
    }
}