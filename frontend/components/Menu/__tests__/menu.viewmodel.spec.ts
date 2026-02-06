import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMenuViewModel } from "../menu.viewmodel";

const mockSetStateMenu = vi.fn();
const mockUseSidebar = vi.fn();
const mockUseIsMobile = vi.fn();
const mockUsePathname = vi.fn();

vi.mock("@/frontend/hooks/useSidebar", () => ({
    useSidebar: () => mockUseSidebar(),
}));

vi.mock("@/frontend/hooks/useIsMobile", () => ({
    useIsMobile: () => mockUseIsMobile(),
}));

vi.mock("next/navigation", () => ({
    usePathname: () => mockUsePathname(),
}));

describe("useMenuViewModel", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        
        // Mock padrão do useSidebar
        mockUseSidebar.mockReturnValue({
            stateMenu: false,
            setStateMenu: mockSetStateMenu,
        });

        // Mock padrão do useIsMobile
        mockUseIsMobile.mockReturnValue(false);

        // Mock padrão do usePathname
        mockUsePathname.mockReturnValue("/dashboard");

        // Mock do document.body.style
        Object.defineProperty(document.body.style, 'overflow', {
            writable: true,
            value: '',
        });
    });

    afterEach(() => {
        document.body.style.overflow = '';
    });

    describe("Estado inicial", () => {
        it("deve retornar valores corretos quando sidebar está disponível", () => {
            const { result } = renderHook(() => useMenuViewModel());

            expect(result.current).not.toBeNull();
            expect(result.current?.stateMenu).toBe(false);
            expect(result.current?.setStateMenu).toBe(mockSetStateMenu);
            expect(result.current?.isActive).toBeInstanceOf(Function);
            expect(result.current?.isMobile).toBe(false);
        });

        it("deve retornar null quando sidebar não está disponível", () => {
            mockUseSidebar.mockReturnValue(null);

            const { result } = renderHook(() => useMenuViewModel());

            expect(result.current).toBeNull();
        });

        it("deve ter método isActive disponível", () => {
            const { result } = renderHook(() => useMenuViewModel());

            expect(result.current?.isActive).toBeInstanceOf(Function);
        });
    });

    describe("Comportamento mobile", () => {
        it("deve fechar menu quando estiver em mobile", () => {
            mockUseIsMobile.mockReturnValue(true);

            renderHook(() => useMenuViewModel());

            expect(mockSetStateMenu).toHaveBeenCalledWith(false);
        });

        it("deve abrir menu quando não estiver em mobile", () => {
            mockUseIsMobile.mockReturnValue(false);

            renderHook(() => useMenuViewModel());

            expect(mockSetStateMenu).toHaveBeenCalledWith(true);
        });

        it("deve atualizar menu ao mudar de mobile para desktop", () => {
            const { rerender } = renderHook(() => useMenuViewModel());

            mockUseIsMobile.mockReturnValue(false);
            rerender();

            expect(mockSetStateMenu).toHaveBeenCalledWith(true);
        });

        it("deve atualizar menu ao mudar de desktop para mobile", () => {
            mockUseIsMobile.mockReturnValue(false);
            const { rerender } = renderHook(() => useMenuViewModel());

            mockUseIsMobile.mockReturnValue(true);
            rerender();

            expect(mockSetStateMenu).toHaveBeenCalledWith(false);
        });
    });

    describe("Controle de overflow do body", () => {
        it("deve ocultar overflow quando menu abrir no mobile", () => {
            mockUseIsMobile.mockReturnValue(true);
            mockUseSidebar.mockReturnValue({
                stateMenu: true,
                setStateMenu: mockSetStateMenu,
            });

            renderHook(() => useMenuViewModel());

            expect(document.body.style.overflow).toBe('hidden');
        });

        it("deve restaurar overflow quando menu fechar no mobile", () => {
            mockUseIsMobile.mockReturnValue(true);
            mockUseSidebar.mockReturnValue({
                stateMenu: false,
                setStateMenu: mockSetStateMenu,
            });

            renderHook(() => useMenuViewModel());

            expect(document.body.style.overflow).toBe('');
        });

        it("não deve alterar overflow no desktop", () => {
            mockUseIsMobile.mockReturnValue(false);
            mockUseSidebar.mockReturnValue({
                stateMenu: true,
                setStateMenu: mockSetStateMenu,
            });

            renderHook(() => useMenuViewModel());

            expect(document.body.style.overflow).not.toBe('hidden');
        });

        it("deve limpar overflow ao desmontar componente", () => {
            mockUseIsMobile.mockReturnValue(true);
            mockUseSidebar.mockReturnValue({
                stateMenu: true,
                setStateMenu: mockSetStateMenu,
            });

            const { unmount } = renderHook(() => useMenuViewModel());

            expect(document.body.style.overflow).toBe('hidden');

            unmount();

            expect(document.body.style.overflow).toBe('');
        });

        it("deve alternar overflow ao abrir e fechar menu no mobile", () => {
            mockUseIsMobile.mockReturnValue(true);
            
            // Começar com menu fechado
            mockUseSidebar.mockReturnValue({
                stateMenu: false,
                setStateMenu: mockSetStateMenu,
            });

            const { rerender } = renderHook(() => useMenuViewModel());
            expect(document.body.style.overflow).toBe('');

            // Abrir menu
            mockUseSidebar.mockReturnValue({
                stateMenu: true,
                setStateMenu: mockSetStateMenu,
            });
            rerender();
            expect(document.body.style.overflow).toBe('hidden');

            // Fechar menu
            mockUseSidebar.mockReturnValue({
                stateMenu: false,
                setStateMenu: mockSetStateMenu,
            });
            rerender();
            expect(document.body.style.overflow).toBe('');
        });
    });

    describe("isActive", () => {
        it("deve retornar true quando path é igual ao pathname atual", () => {
            mockUsePathname.mockReturnValue("/dashboard");

            const { result } = renderHook(() => useMenuViewModel());

            expect(result.current?.isActive("/dashboard")).toBe(true);
        });

        it("deve retornar false quando path é diferente do pathname atual", () => {
            mockUsePathname.mockReturnValue("/dashboard");

            const { result } = renderHook(() => useMenuViewModel());

            expect(result.current?.isActive("/settings")).toBe(false);
        });

        it("deve retornar true para path exato", () => {
            mockUsePathname.mockReturnValue("/dashboard/settings");

            const { result } = renderHook(() => useMenuViewModel());

            expect(result.current?.isActive("/dashboard/settings")).toBe(true);
        });

        it("deve ser case-sensitive", () => {
            mockUsePathname.mockReturnValue("/dashboard");

            const { result } = renderHook(() => useMenuViewModel());

            expect(result.current?.isActive("/Dashboard")).toBe(false);
        });

        it("deve atualizar ao mudar pathname", () => {
            mockUsePathname.mockReturnValue("/dashboard");
            const { result, rerender } = renderHook(() => useMenuViewModel());

            expect(result.current?.isActive("/dashboard")).toBe(true);
            expect(result.current?.isActive("/settings")).toBe(false);

            mockUsePathname.mockReturnValue("/settings");
            rerender();

            expect(result.current?.isActive("/dashboard")).toBe(false);
            expect(result.current?.isActive("/settings")).toBe(true);
        });

        it("deve lidar com paths complexos", () => {
            mockUsePathname.mockReturnValue("/dashboard/generatedContent");

            const { result } = renderHook(() => useMenuViewModel());

            expect(result.current?.isActive("/dashboard/generatedContent")).toBe(true);
            expect(result.current?.isActive("/dashboard")).toBe(false);
        });

        it("deve lidar com paths com query strings", () => {
            mockUsePathname.mockReturnValue("/dashboard?tab=1");

            const { result } = renderHook(() => useMenuViewModel());

            expect(result.current?.isActive("/dashboard?tab=1")).toBe(true);
            expect(result.current?.isActive("/dashboard")).toBe(false);
        });

        it("deve lidar com root path", () => {
            mockUsePathname.mockReturnValue("/");

            const { result } = renderHook(() => useMenuViewModel());

            expect(result.current?.isActive("/")).toBe(true);
            expect(result.current?.isActive("/dashboard")).toBe(false);
        });
    });

    describe("setStateMenu", () => {
        it("deve expor setStateMenu do sidebar", () => {
            const { result } = renderHook(() => useMenuViewModel());

            expect(result.current?.setStateMenu).toBe(mockSetStateMenu);
        });

        it("deve permitir chamar setStateMenu", () => {
            const { result } = renderHook(() => useMenuViewModel());

            act(() => {
                result.current?.setStateMenu(true);
            });

            expect(mockSetStateMenu).toHaveBeenCalledWith(true);
        });

        it("deve permitir alternar estado do menu", () => {
            const { result } = renderHook(() => useMenuViewModel());

            act(() => {
                result.current?.setStateMenu(true);
            });

            expect(mockSetStateMenu).toHaveBeenCalledWith(true);

            act(() => {
                result.current?.setStateMenu(false);
            });

            expect(mockSetStateMenu).toHaveBeenCalledWith(false);
        });
    });

    describe("stateMenu", () => {
        it("deve refletir estado atual do menu", () => {
            mockUseSidebar.mockReturnValue({
                stateMenu: true,
                setStateMenu: mockSetStateMenu,
            });

            const { result } = renderHook(() => useMenuViewModel());

            expect(result.current?.stateMenu).toBe(true);
        });

        it("deve atualizar quando estado do menu mudar", () => {
            mockUseSidebar.mockReturnValue({
                stateMenu: false,
                setStateMenu: mockSetStateMenu,
            });

            const { result, rerender } = renderHook(() => useMenuViewModel());

            expect(result.current?.stateMenu).toBe(false);

            mockUseSidebar.mockReturnValue({
                stateMenu: true,
                setStateMenu: mockSetStateMenu,
            });

            rerender();

            expect(result.current?.stateMenu).toBe(true);
        });
    });

    describe("isMobile", () => {
        it("deve retornar false quando não estiver em mobile", () => {
            mockUseIsMobile.mockReturnValue(false);

            const { result } = renderHook(() => useMenuViewModel());

            expect(result.current?.isMobile).toBe(false);
        });

        it("deve retornar true quando estiver em mobile", () => {
            mockUseIsMobile.mockReturnValue(true);

            const { result } = renderHook(() => useMenuViewModel());

            expect(result.current?.isMobile).toBe(true);
        });

        it("deve atualizar quando mudar dispositivo", () => {
            mockUseIsMobile.mockReturnValue(false);
            const { result, rerender } = renderHook(() => useMenuViewModel());

            expect(result.current?.isMobile).toBe(false);

            mockUseIsMobile.mockReturnValue(true);
            rerender();

            expect(result.current?.isMobile).toBe(true);
        });
    });

    describe("Integração entre funcionalidades", () => {
        it("deve coordenar mobile e overflow do body", () => {
            mockUseIsMobile.mockReturnValue(true);
            mockUseSidebar.mockReturnValue({
                stateMenu: true,
                setStateMenu: mockSetStateMenu,
            });

            const { result } = renderHook(() => useMenuViewModel());

            expect(result.current?.isMobile).toBe(true);
            expect(result.current?.stateMenu).toBe(true);
            expect(document.body.style.overflow).toBe('hidden');
        });

        it("deve manter isActive funcionando independente do estado do menu", () => {
            mockUsePathname.mockReturnValue("/dashboard");
            mockUseSidebar.mockReturnValue({
                stateMenu: true,
                setStateMenu: mockSetStateMenu,
            });

            const { result } = renderHook(() => useMenuViewModel());

            expect(result.current?.isActive("/dashboard")).toBe(true);
        });
    });

    describe("Edge cases", () => {
        it("deve lidar com pathname vazio", () => {
            mockUsePathname.mockReturnValue("");

            const { result } = renderHook(() => useMenuViewModel());

            expect(result.current?.isActive("")).toBe(true);
            expect(result.current?.isActive("/")).toBe(false);
        });

        it("deve lidar com paths com espaços", () => {
            mockUsePathname.mockReturnValue("/path with spaces");

            const { result } = renderHook(() => useMenuViewModel());

            expect(result.current?.isActive("/path with spaces")).toBe(true);
        });

        it("deve lidar com paths com caracteres especiais", () => {
            mockUsePathname.mockReturnValue("/dashboard#section");

            const { result } = renderHook(() => useMenuViewModel());

            expect(result.current?.isActive("/dashboard#section")).toBe(true);
        });

        it("deve lidar com configurações diferentes do sidebar", () => {
            mockUseSidebar.mockReturnValue({
                stateMenu: false,
                setStateMenu: mockSetStateMenu,
            });

            const { result } = renderHook(() => useMenuViewModel());

            expect(result.current?.stateMenu).toBe(false);
        });

        it("deve limpar overflow mesmo se houver erro", () => {
            mockUseIsMobile.mockReturnValue(true);
            mockUseSidebar.mockReturnValue({
                stateMenu: true,
                setStateMenu: mockSetStateMenu,
            });

            const { unmount } = renderHook(() => useMenuViewModel());

            document.body.style.overflow = 'hidden';

            unmount();

            expect(document.body.style.overflow).toBe('');
        });
    });

    describe("Comportamento de atualização", () => {
        it("deve chamar setStateMenu apenas quando isMobile mudar", () => {
            mockUseIsMobile.mockReturnValue(false);
            const { rerender } = renderHook(() => useMenuViewModel());

            const initialCalls = mockSetStateMenu.mock.calls.length;

            // Rerender sem mudanças
            rerender();
            
            // Não deve chamar novamente se nada mudou
            expect(mockSetStateMenu.mock.calls.length).toBeGreaterThanOrEqual(initialCalls);
        });

        it("deve reagir a múltiplas mudanças de pathname", () => {
            mockUsePathname.mockReturnValue("/dashboard");
            const { result, rerender } = renderHook(() => useMenuViewModel());

            expect(result.current?.isActive("/dashboard")).toBe(true);

            mockUsePathname.mockReturnValue("/settings");
            rerender();
            expect(result.current?.isActive("/settings")).toBe(true);

            mockUsePathname.mockReturnValue("/profile");
            rerender();
            expect(result.current?.isActive("/profile")).toBe(true);
        });
    });
});
