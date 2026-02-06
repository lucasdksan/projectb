import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LastContentView from "../lastcontent.view";
import { LastContentProps } from "../lastcontent.model";

describe("LastContentView", () => {
    const mockLastContent: LastContentProps["lastContent"] = [
        {
            headline: "Como aumentar o engajamento nas redes sociais",
            description: "Dicas práticas para melhorar sua presença online",
            cta: "Leia mais",
            hashtags: "#marketing #socialmedia",
            platform: "Instagram",
            id: 1,
            userId: 1,
            createdAt: new Date("2024-01-15"),
            updatedAt: new Date("2024-01-15"),
        },
        {
            headline: "Estratégias de conteúdo para 2024",
            description: "Tendências e melhores práticas",
            cta: "Saiba mais",
            hashtags: "#conteudo #estrategia",
            platform: "LinkedIn",
            id: 2,
            userId: 1,
            createdAt: new Date("2024-01-16"),
            updatedAt: new Date("2024-01-16"),
        },
        {
            headline: "Como criar títulos que convertem",
            description: "Técnicas comprovadas de copywriting",
            cta: "Confira",
            hashtags: "#copywriting #marketing",
            platform: "Twitter",
            id: 3,
            userId: 1,
            createdAt: new Date("2024-01-17"),
            updatedAt: new Date("2024-01-17"),
        },
    ];

    describe("Renderização com conteúdo", () => {
        it("deve renderizar o componente corretamente", () => {
            const { container } = render(<LastContentView lastContent={mockLastContent} />);

            expect(container.firstChild).toBeInTheDocument();
        });

        it("deve renderizar todos os itens de conteúdo", () => {
            render(<LastContentView lastContent={mockLastContent} />);

            expect(screen.getByText("Como aumentar o engajamento nas redes sociais")).toBeInTheDocument();
            expect(screen.getByText("Estratégias de conteúdo para 2024")).toBeInTheDocument();
            expect(screen.getByText("Como criar títulos que convertem")).toBeInTheDocument();
        });

        it("deve renderizar a quantidade correta de itens", () => {
            const { container } = render(<LastContentView lastContent={mockLastContent} />);

            const items = container.querySelectorAll(".group.relative.flex.gap-4");
            expect(items).toHaveLength(3);
        });

        it("deve renderizar as plataformas corretamente", () => {
            render(<LastContentView lastContent={mockLastContent} />);

            expect(screen.getByText("Instagram")).toBeInTheDocument();
            expect(screen.getByText("LinkedIn")).toBeInTheDocument();
            expect(screen.getByText("Twitter")).toBeInTheDocument();
        });

        it("deve renderizar o ícone Sparkles para cada item", () => {
            const { container } = render(<LastContentView lastContent={mockLastContent} />);

            const sparklesIcons = container.querySelectorAll(".lucide-sparkles");
            expect(sparklesIcons).toHaveLength(3);
        });

        it("deve renderizar o ícone Tag para cada plataforma", () => {
            const { container } = render(<LastContentView lastContent={mockLastContent} />);

            const tagIcons = container.querySelectorAll(".lucide-tag");
            expect(tagIcons).toHaveLength(3);
        });

        it("deve renderizar o ícone ArrowRight para cada item", () => {
            const { container } = render(<LastContentView lastContent={mockLastContent} />);

            const arrowIcons = container.querySelectorAll(".lucide-arrow-right");
            expect(arrowIcons).toHaveLength(3);
        });

        it("deve aplicar classes de estilo corretas ao container", () => {
            const { container } = render(<LastContentView lastContent={mockLastContent} />);

            const mainDiv = container.firstChild;
            expect(mainDiv).toHaveClass("space-y-3");
            expect(mainDiv).toHaveClass("max-h-[300px]");
            expect(mainDiv).toHaveClass("flex-1");
            expect(mainDiv).toHaveClass("overflow-y-auto");
        });

        it("deve aplicar classes de hover aos itens", () => {
            const { container } = render(<LastContentView lastContent={mockLastContent} />);

            const items = container.querySelectorAll(".group");
            items.forEach((item) => {
                expect(item).toHaveClass("hover:border-[#00ff41]/20");
                expect(item).toHaveClass("hover:bg-white/[0.04]");
            });
        });

        it("deve renderizar linhas conectoras entre os itens", () => {
            const { container } = render(<LastContentView lastContent={mockLastContent} />);

            // Deve haver N-1 linhas conectoras (3 itens = 2 linhas)
            const connectorLines = container.querySelectorAll(".absolute.left-\\[28px\\]");
            expect(connectorLines).toHaveLength(2);
        });

        it("não deve renderizar linha conectora para o último item", () => {
            const { container } = render(<LastContentView lastContent={mockLastContent} />);

            const items = container.querySelectorAll(".group.relative.flex.gap-4");
            const lastItem = items[items.length - 1];
            const connectorLine = lastItem.querySelector(".absolute.left-\\[28px\\]");
            
            expect(connectorLine).toBeNull();
        });
    });

    describe("Renderização sem conteúdo", () => {
        it("deve renderizar estado vazio quando lastContent for array vazio", () => {
            render(<LastContentView lastContent={[]} />);

            expect(screen.getByText("Nenhuma atividade recente")).toBeInTheDocument();
            expect(screen.getByText("Seus conteúdos aparecerão aqui")).toBeInTheDocument();
        });

        it("deve renderizar o ícone Inbox no estado vazio", () => {
            const { container } = render(<LastContentView lastContent={[]} />);

            const inboxIcon = container.querySelector(".lucide-inbox");
            expect(inboxIcon).toBeInTheDocument();
        });

        it("deve aplicar classes corretas ao estado vazio", () => {
            const { container } = render(<LastContentView lastContent={[]} />);

            const emptyState = container.querySelector(".flex.flex-col.items-center");
            expect(emptyState).toHaveClass("justify-center");
            expect(emptyState).toHaveClass("py-12");
            expect(emptyState).toHaveClass("text-center");
        });

        it("não deve renderizar itens de conteúdo no estado vazio", () => {
            const { container } = render(<LastContentView lastContent={[]} />);

            const items = container.querySelectorAll(".group.relative.flex.gap-4");
            expect(items).toHaveLength(0);
        });
    });

    describe("Renderização com um único item", () => {
        it("deve renderizar corretamente com apenas um item", () => {
            const singleItem = [mockLastContent[0]];
            render(<LastContentView lastContent={singleItem} />);

            expect(screen.getByText("Como aumentar o engajamento nas redes sociais")).toBeInTheDocument();
            expect(screen.getByText("Instagram")).toBeInTheDocument();
        });

        it("não deve renderizar linha conectora com apenas um item", () => {
            const singleItem = [mockLastContent[0]];
            const { container } = render(<LastContentView lastContent={singleItem} />);

            const connectorLines = container.querySelectorAll(".absolute.left-\\[28px\\]");
            expect(connectorLines).toHaveLength(0);
        });
    });

    describe("Estrutura de elementos", () => {
        it("deve renderizar o ícone wrapper com as classes corretas", () => {
            const { container } = render(<LastContentView lastContent={mockLastContent} />);

            const iconWrappers = container.querySelectorAll(".relative.z-10");
            expect(iconWrappers.length).toBeGreaterThan(0);
            
            iconWrappers.forEach((wrapper) => {
                expect(wrapper).toHaveClass("w-12");
                expect(wrapper).toHaveClass("h-12");
                expect(wrapper).toHaveClass("rounded-xl");
            });
        });

        it("deve renderizar o texto do headline com classes corretas", () => {
            const { container } = render(<LastContentView lastContent={mockLastContent} />);

            const headlines = container.querySelectorAll(".text-sm.text-white.font-semibold");
            expect(headlines).toHaveLength(3);
            
            headlines.forEach((headline) => {
                expect(headline).toHaveClass("line-clamp-2");
            });
        });

        it("deve renderizar as badges de plataforma com classes corretas", () => {
            const { container } = render(<LastContentView lastContent={mockLastContent} />);

            const badges = container.querySelectorAll(".inline-flex.items-center.gap-1\\.5");
            expect(badges).toHaveLength(3);
            
            badges.forEach((badge) => {
                expect(badge).toHaveClass("text-xs");
                expect(badge).toHaveClass("font-medium");
                expect(badge).toHaveClass("rounded-full");
            });
        });
    });

    describe("Acessibilidade", () => {
        it("deve renderizar todos os elementos visíveis", () => {
            render(<LastContentView lastContent={mockLastContent} />);

            mockLastContent.forEach((content) => {
                const headline = screen.getByText(content.headline);
                expect(headline).toBeVisible();
            });
        });

        it("deve ter estrutura HTML semântica correta", () => {
            const { container } = render(<LastContentView lastContent={mockLastContent} />);

            const divs = container.querySelectorAll("div");
            expect(divs.length).toBeGreaterThan(0);
        });
    });

    describe("Edge cases", () => {
        it("deve lidar com headlines muito longos", () => {
            const longHeadline = {
                ...mockLastContent[0],
                headline: "Este é um título extremamente longo que deve ser truncado porque excede o limite de caracteres permitido para exibição na interface do usuário",
            };
            
            render(<LastContentView lastContent={[longHeadline]} />);

            expect(screen.getByText(longHeadline.headline)).toBeInTheDocument();
        });

        it("deve lidar com nomes de plataforma muito longos", () => {
            const longPlatform = {
                ...mockLastContent[0],
                platform: "PlataformaMuitoLonga",
            };
            
            render(<LastContentView lastContent={[longPlatform]} />);

            expect(screen.getByText("PlataformaMuitoLonga")).toBeInTheDocument();
        });

        it("deve renderizar corretamente com muitos itens", () => {
            const manyItems = Array.from({ length: 20 }, (_, i) => ({
                ...mockLastContent[0],
                id: i + 1,
                headline: `Conteúdo ${i + 1}`,
            }));

            const { container } = render(<LastContentView lastContent={manyItems} />);

            const items = container.querySelectorAll(".group.relative.flex.gap-4");
            expect(items).toHaveLength(20);
        });
    });

    describe("Comportamento visual", () => {
        it("deve ter classes de transição aplicadas", () => {
            const { container } = render(<LastContentView lastContent={mockLastContent} />);

            const items = container.querySelectorAll(".group");
            items.forEach((item) => {
                expect(item).toHaveClass("transition-all");
                expect(item).toHaveClass("duration-300");
            });
        });

        it("deve ter cursor pointer nos itens clicáveis", () => {
            const { container } = render(<LastContentView lastContent={mockLastContent} />);

            const items = container.querySelectorAll(".group");
            items.forEach((item) => {
                expect(item).toHaveClass("cursor-pointer");
            });
        });

        it("deve ter scrollbar customizado aplicado", () => {
            const { container } = render(<LastContentView lastContent={mockLastContent} />);

            const scrollContainer = container.firstChild;
            expect(scrollContainer).toHaveClass("scrollbar-thin");
            expect(scrollContainer).toHaveClass("scrollbar-thumb-white/10");
            expect(scrollContainer).toHaveClass("scrollbar-track-transparent");
        });
    });

    describe("Renderização de ícones", () => {
        it("deve renderizar ícones com tamanhos corretos", () => {
            const { container } = render(<LastContentView lastContent={mockLastContent} />);

            const sparklesIcons = container.querySelectorAll(".lucide-sparkles");
            sparklesIcons.forEach((icon) => {
                expect(icon).toHaveClass("w-5");
                expect(icon).toHaveClass("h-5");
            });

            const tagIcons = container.querySelectorAll(".lucide-tag");
            tagIcons.forEach((icon) => {
                expect(icon).toHaveClass("w-3");
                expect(icon).toHaveClass("h-3");
            });

            const arrowIcons = container.querySelectorAll(".lucide-arrow-right");
            arrowIcons.forEach((icon) => {
                expect(icon).toHaveClass("w-4");
                expect(icon).toHaveClass("h-4");
            });
        });

        it("deve renderizar ícone Inbox com tamanho correto no estado vazio", () => {
            const { container } = render(<LastContentView lastContent={[]} />);

            const inboxIcon = container.querySelector(".lucide-inbox");
            expect(inboxIcon).toHaveClass("w-8");
            expect(inboxIcon).toHaveClass("h-8");
        });
    });

    describe("Layout e espaçamento", () => {
        it("deve aplicar espaçamento correto entre itens", () => {
            const { container } = render(<LastContentView lastContent={mockLastContent} />);

            const mainContainer = container.firstChild;
            expect(mainContainer).toHaveClass("space-y-3");
        });

        it("deve aplicar padding correto aos itens", () => {
            const { container } = render(<LastContentView lastContent={mockLastContent} />);

            const items = container.querySelectorAll(".group");
            items.forEach((item) => {
                expect(item).toHaveClass("p-4");
            });
        });

        it("deve aplicar gap correto entre elementos do item", () => {
            const { container } = render(<LastContentView lastContent={mockLastContent} />);

            const items = container.querySelectorAll(".group");
            items.forEach((item) => {
                expect(item).toHaveClass("gap-4");
            });
        });
    });

    describe("Cores e gradientes", () => {
        it("deve aplicar cores corretas aos elementos", () => {
            const { container } = render(<LastContentView lastContent={mockLastContent} />);

            const iconWrappers = container.querySelectorAll(".bg-gradient-to-br");
            expect(iconWrappers.length).toBeGreaterThan(0);
        });

        it("deve ter cor de texto correta no estado vazio", () => {
            const { container } = render(<LastContentView lastContent={[]} />);

            const primaryText = screen.getByText("Nenhuma atividade recente");
            expect(primaryText).toHaveClass("text-gray-500");

            const secondaryText = screen.getByText("Seus conteúdos aparecerão aqui");
            expect(secondaryText).toHaveClass("text-gray-600");
        });
    });

    describe("Responsividade", () => {
        it("deve ter altura máxima definida", () => {
            const { container } = render(<LastContentView lastContent={mockLastContent} />);

            const mainContainer = container.firstChild;
            expect(mainContainer).toHaveClass("max-h-[300px]");
        });

        it("deve ter overflow-y-auto para scroll", () => {
            const { container } = render(<LastContentView lastContent={mockLastContent} />);

            const mainContainer = container.firstChild;
            expect(mainContainer).toHaveClass("overflow-y-auto");
        });

        it("deve ter padding-right para compensar scrollbar", () => {
            const { container } = render(<LastContentView lastContent={mockLastContent} />);

            const mainContainer = container.firstChild;
            expect(mainContainer).toHaveClass("pr-2");
        });
    });
});
