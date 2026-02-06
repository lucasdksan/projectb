import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ListContentView from "../listcontent.view";
import useListContentViewModel from "../listcontent.viewmodel";
import { ContentAI } from "@prisma/client";

vi.mock("../listcontent.viewmodel");

describe("ListContentView", () => {
    const mockContents: ContentAI[] = [
        {
            id: 1,
            headline: "Como aumentar suas vendas online",
            description: "Dicas práticas para melhorar suas vendas no Instagram",
            cta: "Saiba mais no link da bio",
            hashtags: "#vendas #instagram #dicas",
            platform: "instagram",
            userId: 1,
            createdAt: new Date("2024-01-15"),
            updatedAt: new Date("2024-01-15"),
        },
        {
            id: 2,
            headline: "Estratégias de marketing digital",
            description: "Como criar campanhas eficazes no LinkedIn",
            cta: "Agende uma consulta",
            hashtags: "#marketing #linkedin #negocios",
            platform: "linkedin",
            userId: 1,
            createdAt: new Date("2024-01-16"),
            updatedAt: new Date("2024-01-16"),
        },
        {
            id: 3,
            headline: "Tendências do TikTok para 2024",
            description: "O que está funcionando agora no TikTok",
            cta: "Confira nossas dicas",
            hashtags: "#tiktok #tendencias #viral",
            platform: "tiktok",
            userId: 1,
            createdAt: new Date("2024-01-17"),
            updatedAt: new Date("2024-01-17"),
        },
    ];

    const mockSetFilter = vi.fn();
    const mockHandleCopy = vi.fn();
    const mockHandleDelete = vi.fn();
    const mockGetPlatformLabel = vi.fn((platform: string) => {
        const labels: Record<string, string> = {
            instagram: "Instagram",
            linkedin: "LinkedIn",
            tiktok: "TikTok",
            twitter: "Twitter/X",
            facebook: "Facebook",
        };
        return labels[platform] || platform;
    });

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useListContentViewModel).mockReturnValue({
            filter: "Todos",
            setFilter: mockSetFilter,
            copiedId: null,
            deletingId: null,
            platforms: ["Todos", "instagram", "facebook", "tiktok", "twitter", "linkedin", "marketplace", "ecommerce"],
            filteredData: mockContents,
            handleCopy: mockHandleCopy,
            handleDelete: mockHandleDelete,
            getPlatformLabel: mockGetPlatformLabel,
        });
    });

    describe("Renderização básica", () => {
        it("deve renderizar o componente corretamente", () => {
            const { container } = render(<ListContentView contents={mockContents} />);
            
            expect(container.firstChild).toBeInTheDocument();
        });

        it("deve renderizar todos os filtros de plataforma", () => {
            render(<ListContentView contents={mockContents} />);

            expect(screen.getByRole("button", { name: "Todos" })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Instagram" })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "LinkedIn" })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "TikTok" })).toBeInTheDocument();
        });

        it("deve renderizar todos os conteúdos", () => {
            render(<ListContentView contents={mockContents} />);

            expect(screen.getByText("Como aumentar suas vendas online")).toBeInTheDocument();
            expect(screen.getByText("Estratégias de marketing digital")).toBeInTheDocument();
            expect(screen.getByText("Tendências do TikTok para 2024")).toBeInTheDocument();
        });

        it("deve renderizar a quantidade correta de cards", () => {
            const { container } = render(<ListContentView contents={mockContents} />);

            const cards = container.querySelectorAll(".bg-\\[\\#161616\\]");
            expect(cards.length).toBeGreaterThanOrEqual(3);
        });
    });

    describe("Filtros de plataforma", () => {
        it("deve chamar setFilter quando clicar em um filtro", () => {
            render(<ListContentView contents={mockContents} />);

            const instagramButton = screen.getByRole("button", { name: "Instagram" });
            fireEvent.click(instagramButton);

            expect(mockSetFilter).toHaveBeenCalledWith("instagram");
        });

        it("deve destacar o filtro ativo", () => {
            vi.mocked(useListContentViewModel).mockReturnValue({
                filter: "instagram",
                setFilter: mockSetFilter,
                copiedId: null,
                deletingId: null,
                platforms: ["Todos", "instagram", "facebook", "tiktok", "twitter", "linkedin", "marketplace", "ecommerce"],
                filteredData: [mockContents[0]],
                handleCopy: mockHandleCopy,
                handleDelete: mockHandleDelete,
                getPlatformLabel: mockGetPlatformLabel,
            });

            render(<ListContentView contents={mockContents} />);

            const instagramButton = screen.getByRole("button", { name: "Instagram" });
            expect(instagramButton).toHaveClass("bg-[#00ff41]");
            expect(instagramButton).toHaveClass("text-black");
        });

        it("deve aplicar classes corretas aos filtros inativos", () => {
            render(<ListContentView contents={mockContents} />);

            const linkedinButton = screen.getByRole("button", { name: "LinkedIn" });
            expect(linkedinButton).toHaveClass("bg-white/5");
            expect(linkedinButton).toHaveClass("text-gray-400");
        });

        it("deve permitir alternar entre filtros", () => {
            render(<ListContentView contents={mockContents} />);

            const todosButton = screen.getByRole("button", { name: "Todos" });
            const tiktokButton = screen.getByRole("button", { name: "TikTok" });

            fireEvent.click(tiktokButton);
            expect(mockSetFilter).toHaveBeenCalledWith("tiktok");

            fireEvent.click(todosButton);
            expect(mockSetFilter).toHaveBeenCalledWith("Todos");
        });
    });

    describe("Cards de conteúdo", () => {
        it("deve renderizar as informações corretas em cada card", () => {
            render(<ListContentView contents={mockContents} />);

            expect(screen.getByText("Como aumentar suas vendas online")).toBeInTheDocument();
            expect(screen.getByText("Dicas práticas para melhorar suas vendas no Instagram")).toBeInTheDocument();
            expect(screen.getByText("Saiba mais no link da bio")).toBeInTheDocument();
        });

        it("deve renderizar as badges de plataforma corretamente", () => {
            render(<ListContentView contents={mockContents} />);

            const badges = screen.getAllByText("Instagram");
            expect(badges.length).toBeGreaterThan(0);
        });

        it("deve renderizar as datas de criação formatadas", () => {
            const { container } = render(<ListContentView contents={mockContents} />);

            // Verifica que há elementos de data renderizados
            const dateElements = container.querySelectorAll(".text-\\[10px\\].text-gray-600.font-mono");
            expect(dateElements.length).toBeGreaterThan(0);
        });

        it("deve renderizar o call to action em destaque", () => {
            const { container } = render(<ListContentView contents={mockContents} />);

            const ctaElements = screen.getAllByText("Call to Action");
            expect(ctaElements).toHaveLength(3);
        });

        it("deve renderizar as hashtags separadas", () => {
            render(<ListContentView contents={mockContents} />);

            expect(screen.getByText("#vendas")).toBeInTheDocument();
            expect(screen.getByText("#instagram")).toBeInTheDocument();
            expect(screen.getByText("#dicas")).toBeInTheDocument();
        });

        it("deve aplicar line-clamp aos títulos", () => {
            const { container } = render(<ListContentView contents={mockContents} />);

            const headlines = container.querySelectorAll(".line-clamp-2");
            expect(headlines.length).toBeGreaterThan(0);
        });

        it("deve aplicar line-clamp às descrições", () => {
            const { container } = render(<ListContentView contents={mockContents} />);

            const descriptions = container.querySelectorAll(".line-clamp-3");
            expect(descriptions.length).toBeGreaterThan(0);
        });
    });

    describe("Botões de ação", () => {
        it("deve renderizar botão de copiar em cada card", () => {
            render(<ListContentView contents={mockContents} />);

            const copyButtons = screen.getAllByRole("button", { name: "Copiar Tudo" });
            expect(copyButtons).toHaveLength(3);
        });

        it("deve chamar handleCopy quando clicar no botão copiar", () => {
            render(<ListContentView contents={mockContents} />);

            const copyButtons = screen.getAllByRole("button", { name: "Copiar Tudo" });
            fireEvent.click(copyButtons[0]);

            expect(mockHandleCopy).toHaveBeenCalledWith(
                1,
                expect.stringContaining("Como aumentar suas vendas online")
            );
        });

        it("deve mostrar feedback quando conteúdo for copiado", () => {
            vi.mocked(useListContentViewModel).mockReturnValue({
                filter: "Todos",
                setFilter: mockSetFilter,
                copiedId: 1,
                deletingId: null,
                platforms: ["Todos", "instagram", "facebook", "tiktok", "twitter", "linkedin", "marketplace", "ecommerce"],
                filteredData: mockContents,
                handleCopy: mockHandleCopy,
                handleDelete: mockHandleDelete,
                getPlatformLabel: mockGetPlatformLabel,
            });

            render(<ListContentView contents={mockContents} />);

            expect(screen.getByText("Copiado!")).toBeInTheDocument();
        });

        it("deve renderizar botão de deletar em cada card", () => {
            const { container } = render(<ListContentView contents={mockContents} />);

            const deleteButtons = container.querySelectorAll(".lucide-trash-2");
            expect(deleteButtons).toHaveLength(3);
        });

        it("deve chamar handleDelete quando clicar no botão deletar", () => {
            const { container } = render(<ListContentView contents={mockContents} />);

            const deleteButtons = container.querySelectorAll("button");
            const deleteButton = Array.from(deleteButtons).find(btn => 
                btn.querySelector(".lucide-trash-2")
            );

            if (deleteButton) {
                fireEvent.click(deleteButton);
                expect(mockHandleDelete).toHaveBeenCalledWith(1);
            }
        });

        it("deve desabilitar botão de deletar durante exclusão", () => {
            vi.mocked(useListContentViewModel).mockReturnValue({
                filter: "Todos",
                setFilter: mockSetFilter,
                copiedId: null,
                deletingId: 1,
                platforms: ["Todos", "instagram", "facebook", "tiktok", "twitter", "linkedin", "marketplace", "ecommerce"],
                filteredData: mockContents,
                handleCopy: mockHandleCopy,
                handleDelete: mockHandleDelete,
                getPlatformLabel: mockGetPlatformLabel,
            });

            const { container } = render(<ListContentView contents={mockContents} />);

            const deleteButtons = container.querySelectorAll("button");
            const deleteButton = Array.from(deleteButtons).find(btn => 
                btn.querySelector(".lucide-trash-2")
            );

            expect(deleteButton).toBeDisabled();
        });

        it("deve mostrar animação de pulse durante exclusão", () => {
            vi.mocked(useListContentViewModel).mockReturnValue({
                filter: "Todos",
                setFilter: mockSetFilter,
                copiedId: null,
                deletingId: 1,
                platforms: ["Todos", "instagram", "facebook", "tiktok", "twitter", "linkedin", "marketplace", "ecommerce"],
                filteredData: mockContents,
                handleCopy: mockHandleCopy,
                handleDelete: mockHandleDelete,
                getPlatformLabel: mockGetPlatformLabel,
            });

            const { container } = render(<ListContentView contents={mockContents} />);

            const trashIcon = container.querySelector(".animate-pulse");
            expect(trashIcon).toBeInTheDocument();
        });
    });

    describe("Estado vazio", () => {
        it("deve renderizar mensagem quando não houver conteúdos", () => {
            vi.mocked(useListContentViewModel).mockReturnValue({
                filter: "Todos",
                setFilter: mockSetFilter,
                copiedId: null,
                deletingId: null,
                platforms: ["Todos", "instagram", "facebook", "tiktok", "twitter", "linkedin", "marketplace", "ecommerce"],
                filteredData: [],
                handleCopy: mockHandleCopy,
                handleDelete: mockHandleDelete,
                getPlatformLabel: mockGetPlatformLabel,
            });

            render(<ListContentView contents={[]} />);

            expect(screen.getByText("Nenhum conteúdo encontrado")).toBeInTheDocument();
            expect(screen.getByText("Você ainda não tem conteúdos salvos para esta plataforma.")).toBeInTheDocument();
        });

        it("deve renderizar ícone PackageOpen no estado vazio", () => {
            vi.mocked(useListContentViewModel).mockReturnValue({
                filter: "Todos",
                setFilter: mockSetFilter,
                copiedId: null,
                deletingId: null,
                platforms: ["Todos", "instagram", "facebook", "tiktok", "twitter", "linkedin", "marketplace", "ecommerce"],
                filteredData: [],
                handleCopy: mockHandleCopy,
                handleDelete: mockHandleDelete,
                getPlatformLabel: mockGetPlatformLabel,
            });

            const { container } = render(<ListContentView contents={[]} />);

            const packageIcon = container.querySelector(".lucide-package-open");
            expect(packageIcon).toBeInTheDocument();
        });

        it("não deve renderizar cards no estado vazio", () => {
            vi.mocked(useListContentViewModel).mockReturnValue({
                filter: "Todos",
                setFilter: mockSetFilter,
                copiedId: null,
                deletingId: null,
                platforms: ["Todos", "instagram", "facebook", "tiktok", "twitter", "linkedin", "marketplace", "ecommerce"],
                filteredData: [],
                handleCopy: mockHandleCopy,
                handleDelete: mockHandleDelete,
                getPlatformLabel: mockGetPlatformLabel,
            });

            render(<ListContentView contents={[]} />);

            expect(screen.queryByText("Call to Action")).not.toBeInTheDocument();
        });
    });

    describe("Ícones", () => {
        it("deve renderizar ícone Copy nos botões de copiar", () => {
            const { container } = render(<ListContentView contents={mockContents} />);

            const copyIcons = container.querySelectorAll(".lucide-copy");
            expect(copyIcons).toHaveLength(3);
        });

        it("deve renderizar ícone Check quando conteúdo for copiado", () => {
            vi.mocked(useListContentViewModel).mockReturnValue({
                filter: "Todos",
                setFilter: mockSetFilter,
                copiedId: 1,
                deletingId: null,
                platforms: ["Todos", "instagram", "facebook", "tiktok", "twitter", "linkedin", "marketplace", "ecommerce"],
                filteredData: mockContents,
                handleCopy: mockHandleCopy,
                handleDelete: mockHandleDelete,
                getPlatformLabel: mockGetPlatformLabel,
            });

            const { container } = render(<ListContentView contents={mockContents} />);

            const checkIcon = container.querySelector(".lucide-check");
            expect(checkIcon).toBeInTheDocument();
        });

        it("deve renderizar ícone Trash2 nos botões de deletar", () => {
            const { container } = render(<ListContentView contents={mockContents} />);

            const trashIcons = container.querySelectorAll(".lucide-trash-2");
            expect(trashIcons).toHaveLength(3);
        });
    });

    describe("Layout e grid", () => {
        it("deve aplicar grid responsivo aos cards", () => {
            const { container } = render(<ListContentView contents={mockContents} />);

            const grid = container.querySelector(".grid");
            expect(grid).toHaveClass("grid-cols-1");
            expect(grid).toHaveClass("xl:grid-cols-2");
        });

        it("deve aplicar espaçamento correto entre elementos", () => {
            const { container } = render(<ListContentView contents={mockContents} />);

            const mainContainer = container.firstChild;
            expect(mainContainer).toHaveClass("space-y-6");
        });

        it("deve aplicar gap correto no grid", () => {
            const { container } = render(<ListContentView contents={mockContents} />);

            const grid = container.querySelector(".grid");
            expect(grid).toHaveClass("gap-6");
        });
    });

    describe("Estilos e classes", () => {
        it("deve aplicar border-radius correto aos cards", () => {
            const { container } = render(<ListContentView contents={mockContents} />);

            const cards = container.querySelectorAll(".rounded-3xl");
            expect(cards.length).toBeGreaterThan(0);
        });

        it("deve aplicar hover effects aos cards", () => {
            const { container } = render(<ListContentView contents={mockContents} />);

            const cards = container.querySelectorAll(".hover\\:border-\\[\\#00ff41\\]\\/30");
            expect(cards.length).toBeGreaterThan(0);
        });

        it("deve aplicar transições aos elementos interativos", () => {
            const { container } = render(<ListContentView contents={mockContents} />);

            const transitionElements = container.querySelectorAll(".transition-all");
            expect(transitionElements.length).toBeGreaterThan(0);
        });

        it("deve ter scrollbar escondida nos filtros", () => {
            const { container } = render(<ListContentView contents={mockContents} />);

            const filterContainer = container.querySelector(".scrollbar-hide");
            expect(filterContainer).toBeInTheDocument();
        });
    });

    describe("Acessibilidade", () => {
        it("deve ter todos os botões acessíveis por role", () => {
            render(<ListContentView contents={mockContents} />);

            const buttons = screen.getAllByRole("button");
            expect(buttons.length).toBeGreaterThan(0);
        });

        it("deve desabilitar botões corretamente", () => {
            vi.mocked(useListContentViewModel).mockReturnValue({
                filter: "Todos",
                setFilter: mockSetFilter,
                copiedId: null,
                deletingId: 1,
                platforms: ["Todos", "instagram", "facebook", "tiktok", "twitter", "linkedin", "marketplace", "ecommerce"],
                filteredData: mockContents,
                handleCopy: mockHandleCopy,
                handleDelete: mockHandleDelete,
                getPlatformLabel: mockGetPlatformLabel,
            });

            const { container } = render(<ListContentView contents={mockContents} />);

            const disabledButton = container.querySelector("button:disabled");
            expect(disabledButton).toHaveClass("disabled:opacity-50");
            expect(disabledButton).toHaveClass("disabled:cursor-not-allowed");
        });
    });

    describe("Formatação de conteúdo", () => {
        it("deve formatar corretamente o texto para copiar", () => {
            render(<ListContentView contents={mockContents} />);

            const copyButtons = screen.getAllByRole("button", { name: "Copiar Tudo" });
            fireEvent.click(copyButtons[0]);

            const expectedText = expect.stringContaining("Como aumentar suas vendas online");
            expect(mockHandleCopy).toHaveBeenCalledWith(1, expectedText);
        });

        it("deve incluir todas as partes do conteúdo ao copiar", () => {
            render(<ListContentView contents={mockContents} />);

            const copyButtons = screen.getAllByRole("button", { name: "Copiar Tudo" });
            fireEvent.click(copyButtons[0]);

            expect(mockHandleCopy).toHaveBeenCalledWith(
                1,
                expect.stringContaining("Dicas práticas para melhorar suas vendas no Instagram")
            );
            expect(mockHandleCopy).toHaveBeenCalledWith(
                1,
                expect.stringContaining("Saiba mais no link da bio")
            );
            expect(mockHandleCopy).toHaveBeenCalledWith(
                1,
                expect.stringContaining("#vendas #instagram #dicas")
            );
        });

        it("deve chamar getPlatformLabel para cada plataforma", () => {
            render(<ListContentView contents={mockContents} />);

            expect(mockGetPlatformLabel).toHaveBeenCalled();
        });
    });

    describe("Edge cases", () => {
        it("deve lidar com conteúdo sem hashtags", () => {
            const contentWithoutHashtags = [{
                ...mockContents[0],
                hashtags: "",
            }];

            vi.mocked(useListContentViewModel).mockReturnValue({
                filter: "Todos",
                setFilter: mockSetFilter,
                copiedId: null,
                deletingId: null,
                platforms: ["Todos", "instagram", "facebook", "tiktok", "twitter", "linkedin", "marketplace", "ecommerce"],
                filteredData: contentWithoutHashtags,
                handleCopy: mockHandleCopy,
                handleDelete: mockHandleDelete,
                getPlatformLabel: mockGetPlatformLabel,
            });

            const { container } = render(<ListContentView contents={contentWithoutHashtags} />);
            
            expect(container).toBeInTheDocument();
        });

        it("deve lidar com descrições muito longas", () => {
            const longDescription = {
                ...mockContents[0],
                description: "Esta é uma descrição muito longa ".repeat(20),
            };

            vi.mocked(useListContentViewModel).mockReturnValue({
                filter: "Todos",
                setFilter: mockSetFilter,
                copiedId: null,
                deletingId: null,
                platforms: ["Todos", "instagram", "facebook", "tiktok", "twitter", "linkedin", "marketplace", "ecommerce"],
                filteredData: [longDescription],
                handleCopy: mockHandleCopy,
                handleDelete: mockHandleDelete,
                getPlatformLabel: mockGetPlatformLabel,
            });

            render(<ListContentView contents={[longDescription]} />);

            expect(screen.getByText(/Esta é uma descrição muito longa/)).toBeInTheDocument();
        });

        it("deve lidar com um único conteúdo", () => {
            const singleContent = [mockContents[0]];

            vi.mocked(useListContentViewModel).mockReturnValue({
                filter: "Todos",
                setFilter: mockSetFilter,
                copiedId: null,
                deletingId: null,
                platforms: ["Todos", "instagram", "facebook", "tiktok", "twitter", "linkedin", "marketplace", "ecommerce"],
                filteredData: singleContent,
                handleCopy: mockHandleCopy,
                handleDelete: mockHandleDelete,
                getPlatformLabel: mockGetPlatformLabel,
            });

            render(<ListContentView contents={singleContent} />);

            expect(screen.getByText("Como aumentar suas vendas online")).toBeInTheDocument();
        });
    });
});
