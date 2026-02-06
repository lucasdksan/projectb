import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MenuView from "../menu.view";
import { useMenuViewModel } from "../menu.viewmodel";

vi.mock("../menu.viewmodel");
vi.mock("next/link", () => ({
    default: ({ children, href, className }: any) => (
        <a href={href} className={className}>
            {children}
        </a>
    ),
}));

vi.mock("@/app/(public)/auth/logout/logout.action", () => ({
    logoutAction: vi.fn(),
}));

describe("MenuView", () => {
    const mockProps = {
        email: "usuario@teste.com",
        name: "João Silva",
    };

    const mockSetStateMenu = vi.fn();
    const mockIsActive = vi.fn((path: string) => path === "/dashboard");

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useMenuViewModel).mockReturnValue({
            isMobile: false,
            stateMenu: false,
            setStateMenu: mockSetStateMenu,
            isActive: mockIsActive,
        });
    });

    describe("Renderização básica", () => {
        it("deve renderizar o componente corretamente", () => {
            const { container } = render(<MenuView {...mockProps} />);
            
            expect(container.firstChild).toBeInTheDocument();
        });

        it("deve renderizar o logo do projeto", () => {
            render(<MenuView {...mockProps} />);

            expect(screen.getByText("Projeto B")).toBeInTheDocument();
        });

        it("deve renderizar todos os itens do menu", () => {
            render(<MenuView {...mockProps} />);

            expect(screen.getByText("Dashboard")).toBeInTheDocument();
            expect(screen.getByText("Conteúdos Salvos")).toBeInTheDocument();
            expect(screen.getByText("Conteúdo IA")).toBeInTheDocument();
            expect(screen.getByText("Configurações")).toBeInTheDocument();
        });

        it("deve renderizar o nome do usuário", () => {
            render(<MenuView {...mockProps} />);

            expect(screen.getByText("João Silva")).toBeInTheDocument();
        });

        it("deve renderizar o email do usuário", () => {
            render(<MenuView {...mockProps} />);

            expect(screen.getByText("usuario@teste.com")).toBeInTheDocument();
        });

        it("deve renderizar o botão de logout", () => {
            render(<MenuView {...mockProps} />);

            expect(screen.getByText("Sair")).toBeInTheDocument();
        });
    });

    describe("Comportamento quando viewModel retorna null", () => {
        it("deve retornar null quando useMenuViewModel retorna null", () => {
            vi.mocked(useMenuViewModel).mockReturnValue(null);

            const { container } = render(<MenuView {...mockProps} />);

            expect(container.firstChild).toBeNull();
        });
    });
});
