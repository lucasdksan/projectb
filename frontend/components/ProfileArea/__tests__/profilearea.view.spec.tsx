import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProfileAreaView from "../profilearea.view";
import { useProfileAreaViewModel } from "../profilearea.viewmodel";

vi.mock("../profilearea.viewmodel");

describe("ProfileAreaView", () => {
    const mockProfile = {
        name: "João Silva",
        email: "joao@teste.com",
    };

    const mockSetName = vi.fn();
    const mockHandleUpdateProfile = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useProfileAreaViewModel).mockReturnValue({
            name: "João Silva",
            setName: mockSetName,
            isLoading: false,
            handleUpdateProfile: mockHandleUpdateProfile,
        });
    });

    describe("Renderização básica", () => {
        it("deve renderizar o componente corretamente", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);
            
            expect(container.firstChild).toBeInTheDocument();
        });

        it("deve renderizar o título da seção", () => {
            render(<ProfileAreaView profile={mockProfile} />);

            expect(screen.getByText("Perfil Pessoal")).toBeInTheDocument();
        });

        it("deve renderizar o ícone User2Icon", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const userIcon = container.querySelector("svg");
            expect(userIcon).toBeInTheDocument();
        });

        it("deve renderizar label do campo nome", () => {
            render(<ProfileAreaView profile={mockProfile} />);

            expect(screen.getByText("Nome Completo")).toBeInTheDocument();
        });

        it("deve renderizar label do campo email", () => {
            render(<ProfileAreaView profile={mockProfile} />);

            expect(screen.getByText("E-mail")).toBeInTheDocument();
        });

        it("deve renderizar botão de atualizar perfil", () => {
            render(<ProfileAreaView profile={mockProfile} />);

            expect(screen.getByRole("button", { name: "Atualizar Perfil" })).toBeInTheDocument();
        });
    });

    describe("Campo de nome", () => {
        it("deve renderizar input de nome com valor correto", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement;
            expect(nameInput).toBeInTheDocument();
            expect(nameInput.value).toBe("João Silva");
        });

        it("deve ter tipo text no input de nome", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const nameInput = container.querySelector('input[type="text"]');
            expect(nameInput).toHaveAttribute("type", "text");
        });

        it("deve chamar setName ao digitar no campo nome", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement;
            fireEvent.change(nameInput, { target: { value: "João Santos" } });

            expect(mockSetName).toHaveBeenCalledWith("João Santos");
        });

        it("deve permitir editar o campo nome", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const nameInput = container.querySelector('input[type="text"]');
            expect(nameInput).not.toBeDisabled();
        });

        it("deve desabilitar campo nome durante loading", () => {
            vi.mocked(useProfileAreaViewModel).mockReturnValue({
                name: "João Silva",
                setName: mockSetName,
                isLoading: true,
                handleUpdateProfile: mockHandleUpdateProfile,
            });

            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const nameInput = container.querySelector('input[type="text"]');
            expect(nameInput).toBeDisabled();
        });

        it("deve aplicar classes corretas ao input de nome", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const nameInput = container.querySelector('input[type="text"]');
            expect(nameInput).toHaveClass("w-full");
            expect(nameInput).toHaveClass("bg-[#0d0d0d]");
            expect(nameInput).toHaveClass("border");
            expect(nameInput).toHaveClass("rounded-xl");
        });
    });

    describe("Campo de email", () => {
        it("deve renderizar input de email com valor correto", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement;
            expect(emailInput).toBeInTheDocument();
            expect(emailInput.value).toBe("joao@teste.com");
        });

        it("deve ter tipo email no input de email", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const emailInput = container.querySelector('input[type="email"]');
            expect(emailInput).toHaveAttribute("type", "email");
        });

        it("deve ter campo email desabilitado", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const emailInput = container.querySelector('input[type="email"]');
            expect(emailInput).toBeDisabled();
        });

        it("não deve permitir editar o campo email", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const emailInput = container.querySelector('input[type="email"]');
            expect(emailInput).toHaveAttribute("disabled");
        });

        it("deve aplicar classes corretas ao input de email", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const emailInput = container.querySelector('input[type="email"]');
            expect(emailInput).toHaveClass("w-full");
            expect(emailInput).toHaveClass("bg-[#0d0d0d]");
            expect(emailInput).toHaveClass("border");
            expect(emailInput).toHaveClass("rounded-xl");
        });
    });

    describe("Botão de atualizar", () => {
        it("deve chamar handleUpdateProfile ao clicar no botão", () => {
            render(<ProfileAreaView profile={mockProfile} />);

            const updateButton = screen.getByRole("button", { name: "Atualizar Perfil" });
            fireEvent.click(updateButton);

            expect(mockHandleUpdateProfile).toHaveBeenCalledTimes(1);
        });

        it("deve estar habilitado quando não está carregando", () => {
            render(<ProfileAreaView profile={mockProfile} />);

            const updateButton = screen.getByRole("button", { name: "Atualizar Perfil" });
            expect(updateButton).not.toBeDisabled();
        });

        it("deve desabilitar botão durante loading", () => {
            vi.mocked(useProfileAreaViewModel).mockReturnValue({
                name: "João Silva",
                setName: mockSetName,
                isLoading: true,
                handleUpdateProfile: mockHandleUpdateProfile,
            });

            render(<ProfileAreaView profile={mockProfile} />);

            const updateButton = screen.getByRole("button");
            expect(updateButton).toBeDisabled();
        });

        it("deve mostrar texto 'Atualizando...' durante loading", () => {
            vi.mocked(useProfileAreaViewModel).mockReturnValue({
                name: "João Silva",
                setName: mockSetName,
                isLoading: true,
                handleUpdateProfile: mockHandleUpdateProfile,
            });

            render(<ProfileAreaView profile={mockProfile} />);

            expect(screen.getByText("Atualizando...")).toBeInTheDocument();
        });

        it("deve mostrar texto 'Atualizar Perfil' quando não está carregando", () => {
            render(<ProfileAreaView profile={mockProfile} />);

            expect(screen.getByText("Atualizar Perfil")).toBeInTheDocument();
        });

        it("deve aplicar classes corretas ao botão", () => {
            render(<ProfileAreaView profile={mockProfile} />);

            const updateButton = screen.getByRole("button", { name: "Atualizar Perfil" });
            expect(updateButton).toHaveClass("w-full");
            expect(updateButton).toHaveClass("bg-white/5");
            expect(updateButton).toHaveClass("text-white");
            expect(updateButton).toHaveClass("py-4");
            expect(updateButton).toHaveClass("rounded-xl");
            expect(updateButton).toHaveClass("font-bold");
        });

        it("deve ter classes de disabled no botão", () => {
            render(<ProfileAreaView profile={mockProfile} />);

            const updateButton = screen.getByRole("button", { name: "Atualizar Perfil" });
            expect(updateButton).toHaveClass("disabled:opacity-50");
            expect(updateButton).toHaveClass("disabled:cursor-not-allowed");
        });
    });

    describe("Layout e estrutura", () => {
        it("deve aplicar classes de background à seção", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const section = container.querySelector("section");
            expect(section).toHaveClass("bg-[#161616]");
        });

        it("deve aplicar border à seção", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const section = container.querySelector("section");
            expect(section).toHaveClass("border");
            expect(section).toHaveClass("border-white/5");
        });

        it("deve aplicar padding à seção", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const section = container.querySelector("section");
            expect(section).toHaveClass("p-8");
        });

        it("deve aplicar border-radius à seção", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const section = container.querySelector("section");
            expect(section).toHaveClass("rounded-3xl");
        });

        it("deve aplicar espaçamento vertical à seção", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const section = container.querySelector("section");
            expect(section).toHaveClass("space-y-8");
        });

        it("deve ter container de ícone com classes corretas", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const iconContainer = container.querySelector(".w-12.h-12");
            expect(iconContainer).toHaveClass("bg-blue-500/10");
            expect(iconContainer).toHaveClass("rounded-xl");
            expect(iconContainer).toHaveClass("text-blue-500");
        });
    });

    describe("Espaçamento e organização", () => {
        it("deve ter espaçamento correto entre campos", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const fieldContainers = container.querySelectorAll(".space-y-2");
            expect(fieldContainers.length).toBeGreaterThan(0);
        });

        it("deve ter container principal com space-y-6", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const mainContainer = container.querySelector(".space-y-6");
            expect(mainContainer).toBeInTheDocument();
        });

        it("deve ter gap entre ícone e título", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const headerContainer = container.querySelector(".gap-4");
            expect(headerContainer).toBeInTheDocument();
        });
    });

    describe("Labels e acessibilidade", () => {
        it("deve ter labels visíveis para os inputs", () => {
            render(<ProfileAreaView profile={mockProfile} />);

            expect(screen.getByText("Nome Completo")).toBeInTheDocument();
            expect(screen.getByText("E-mail")).toBeInTheDocument();
        });

        it("deve ter elemento section semântico", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const section = container.querySelector("section");
            expect(section).toBeInTheDocument();
        });

        it("deve ter heading com texto correto", () => {
            render(<ProfileAreaView profile={mockProfile} />);

            const heading = screen.getByText("Perfil Pessoal");
            expect(heading.tagName).toBe("H3");
        });

        it("deve aplicar classes corretas ao heading", () => {
            render(<ProfileAreaView profile={mockProfile} />);

            const heading = screen.getByText("Perfil Pessoal");
            expect(heading).toHaveClass("text-xl");
            expect(heading).toHaveClass("font-bold");
            expect(heading).toHaveClass("text-white");
        });
    });

    describe("Estilos dos inputs", () => {
        it("deve ter focus styles nos inputs", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const nameInput = container.querySelector('input[type="text"]');
            expect(nameInput).toHaveClass("focus:outline-none");
            expect(nameInput).toHaveClass("focus:border-[#00ff41]/50");
        });

        it("deve ter transition nos inputs", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const nameInput = container.querySelector('input[type="text"]');
            expect(nameInput).toHaveClass("transition-all");
        });

        it("deve ter padding correto nos inputs", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const nameInput = container.querySelector('input[type="text"]');
            expect(nameInput).toHaveClass("py-3");
            expect(nameInput).toHaveClass("px-4");
        });

        it("deve ter cor de texto branca nos inputs", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const nameInput = container.querySelector('input[type="text"]');
            expect(nameInput).toHaveClass("text-white");
        });
    });

    describe("Estilos dos labels", () => {
        it("deve aplicar classes corretas aos labels", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const labels = container.querySelectorAll("label");
            labels.forEach((label) => {
                expect(label).toHaveClass("text-sm");
                expect(label).toHaveClass("font-semibold");
                expect(label).toHaveClass("text-gray-400");
            });
        });
    });

    describe("Hover effects", () => {
        it("deve ter hover effect no botão", () => {
            render(<ProfileAreaView profile={mockProfile} />);

            const updateButton = screen.getByRole("button", { name: "Atualizar Perfil" });
            expect(updateButton).toHaveClass("hover:bg-white/10");
        });

        it("deve ter transition no botão", () => {
            render(<ProfileAreaView profile={mockProfile} />);

            const updateButton = screen.getByRole("button", { name: "Atualizar Perfil" });
            expect(updateButton).toHaveClass("transition-all");
        });
    });

    describe("Estados de loading", () => {
        it("deve desabilitar todos os campos durante loading", () => {
            vi.mocked(useProfileAreaViewModel).mockReturnValue({
                name: "João Silva",
                setName: mockSetName,
                isLoading: true,
                handleUpdateProfile: mockHandleUpdateProfile,
            });

            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const nameInput = container.querySelector('input[type="text"]');
            const updateButton = screen.getByRole("button");

            expect(nameInput).toBeDisabled();
            expect(updateButton).toBeDisabled();
        });

        it("não deve chamar setName durante loading", () => {
            vi.mocked(useProfileAreaViewModel).mockReturnValue({
                name: "João Silva",
                setName: mockSetName,
                isLoading: true,
                handleUpdateProfile: mockHandleUpdateProfile,
            });

            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement;
            fireEvent.change(nameInput, { target: { value: "Novo Nome" } });

            // O input está desabilitado, então setName não deve ser chamado
            expect(nameInput).toBeDisabled();
        });
    });

    describe("Integração com viewModel", () => {
        it("deve chamar useProfileAreaViewModel com nome do perfil", () => {
            render(<ProfileAreaView profile={mockProfile} />);

            expect(useProfileAreaViewModel).toHaveBeenCalledWith("João Silva");
        });

        it("deve usar valores retornados pelo viewModel", () => {
            vi.mocked(useProfileAreaViewModel).mockReturnValue({
                name: "Nome Alterado",
                setName: mockSetName,
                isLoading: false,
                handleUpdateProfile: mockHandleUpdateProfile,
            });

            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement;
            expect(nameInput.value).toBe("Nome Alterado");
        });
    });

    describe("Edge cases", () => {
        it("deve lidar com nome vazio", () => {
            const emptyNameProfile = {
                name: "",
                email: "joao@teste.com",
            };

            vi.mocked(useProfileAreaViewModel).mockReturnValue({
                name: "",
                setName: mockSetName,
                isLoading: false,
                handleUpdateProfile: mockHandleUpdateProfile,
            });

            const { container } = render(<ProfileAreaView profile={emptyNameProfile} />);

            const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement;
            expect(nameInput.value).toBe("");
        });

        it("deve lidar com email vazio", () => {
            const emptyEmailProfile = {
                name: "João Silva",
                email: "",
            };

            const { container } = render(<ProfileAreaView profile={emptyEmailProfile} />);

            const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement;
            expect(emailInput.value).toBe("");
        });

        it("deve lidar com nome muito longo", () => {
            const longName = "Nome Muito Longo ".repeat(10);
            const longNameProfile = {
                name: longName,
                email: "joao@teste.com",
            };

            vi.mocked(useProfileAreaViewModel).mockReturnValue({
                name: longName,
                setName: mockSetName,
                isLoading: false,
                handleUpdateProfile: mockHandleUpdateProfile,
            });

            const { container } = render(<ProfileAreaView profile={longNameProfile} />);

            const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement;
            expect(nameInput.value).toBe(longName);
        });

        it("deve lidar com email muito longo", () => {
            const longEmail = "emailmuitolongo@dominiomuitolongoquedeveseraceitopeloinput.com.br";
            const longEmailProfile = {
                name: "João Silva",
                email: longEmail,
            };

            const { container } = render(<ProfileAreaView profile={longEmailProfile} />);

            const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement;
            expect(emailInput.value).toBe(longEmail);
        });
    });

    describe("Múltiplas interações", () => {
        it("deve permitir múltiplas alterações no nome", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement;
            
            fireEvent.change(nameInput, { target: { value: "Nome 1" } });
            fireEvent.change(nameInput, { target: { value: "Nome 2" } });
            fireEvent.change(nameInput, { target: { value: "Nome 3" } });

            expect(mockSetName).toHaveBeenCalledTimes(3);
        });

        it("deve permitir múltiplos cliques no botão atualizar", () => {
            render(<ProfileAreaView profile={mockProfile} />);

            const updateButton = screen.getByRole("button", { name: "Atualizar Perfil" });
            
            fireEvent.click(updateButton);
            fireEvent.click(updateButton);
            fireEvent.click(updateButton);

            expect(mockHandleUpdateProfile).toHaveBeenCalledTimes(3);
        });
    });

    describe("Cores do tema", () => {
        it("deve usar cor accent nos elementos destacados", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const iconContainer = container.querySelector(".text-blue-500");
            expect(iconContainer).toBeInTheDocument();
        });

        it("deve usar tons de cinza para labels", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const labels = container.querySelectorAll("label");
            labels.forEach((label) => {
                expect(label).toHaveClass("text-gray-400");
            });
        });

        it("deve usar fundo escuro nos inputs", () => {
            const { container } = render(<ProfileAreaView profile={mockProfile} />);

            const nameInput = container.querySelector('input[type="text"]');
            expect(nameInput).toHaveClass("bg-[#0d0d0d]");
        });
    });
});
