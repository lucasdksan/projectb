import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLastContentViewModel } from "../lastcontent.viewmodel";
import { LastContentProps } from "../lastcontent.model";

describe("useLastContentViewModel", () => {
    const mockLastContent: LastContentProps["lastContent"] = [
        {
            headline: "Como aumentar o engajamento nas redes sociais",
            description: "Dicas práticas para melhorar sua presença online",
            cta: "Leia mais",
            hashtags: "#marketing #socialmedia",
            platform: "Instagram",
            id: 1,
            userId: 1,
            createdAt: new Date("2024-01-15T10:00:00"),
            updatedAt: new Date("2024-01-15T10:00:00"),
        },
        {
            headline: "Estratégias de conteúdo para 2024",
            description: "Tendências e melhores práticas",
            cta: "Saiba mais",
            hashtags: "#conteudo #estrategia",
            platform: "LinkedIn",
            id: 2,
            userId: 1,
            createdAt: new Date("2024-01-17T10:00:00"),
            updatedAt: new Date("2024-01-17T10:00:00"),
        },
        {
            headline: "Como criar títulos que convertem",
            description: "Técnicas comprovadas de copywriting",
            cta: "Confira",
            hashtags: "#copywriting #marketing",
            platform: "Twitter",
            id: 3,
            userId: 1,
            createdAt: new Date("2024-01-16T10:00:00"),
            updatedAt: new Date("2024-01-16T10:00:00"),
        },
    ];

    describe("Inicialização", () => {
        it("deve inicializar com valores padrão", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: mockLastContent })
            );

            expect(result.current.selectedContentId).toBeNull();
            expect(result.current.hoveredContentId).toBeNull();
            expect(result.current.hasContent).toBe(true);
        });

        it("deve identificar quando não há conteúdo", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: [] })
            );

            expect(result.current.hasContent).toBe(false);
        });

        it("deve retornar sortedContent ordenado por data de criação (mais recente primeiro)", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: mockLastContent })
            );

            expect(result.current.sortedContent).toHaveLength(3);
            expect(result.current.sortedContent[0].id).toBe(2); // 2024-01-17
            expect(result.current.sortedContent[1].id).toBe(3); // 2024-01-16
            expect(result.current.sortedContent[2].id).toBe(1); // 2024-01-15
        });
    });

    describe("handleContentClick", () => {
        it("deve definir o ID do conteúdo selecionado", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: mockLastContent })
            );

            act(() => {
                result.current.handleContentClick(1);
            });

            expect(result.current.selectedContentId).toBe(1);
        });

        it("deve atualizar o ID do conteúdo selecionado ao clicar em outro", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: mockLastContent })
            );

            act(() => {
                result.current.handleContentClick(1);
            });

            expect(result.current.selectedContentId).toBe(1);

            act(() => {
                result.current.handleContentClick(2);
            });

            expect(result.current.selectedContentId).toBe(2);
        });

        it("deve permitir selecionar o mesmo conteúdo novamente", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: mockLastContent })
            );

            act(() => {
                result.current.handleContentClick(1);
            });

            expect(result.current.selectedContentId).toBe(1);

            act(() => {
                result.current.handleContentClick(1);
            });

            expect(result.current.selectedContentId).toBe(1);
        });
    });

    describe("handleContentHover", () => {
        it("deve definir o ID do conteúdo em hover", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: mockLastContent })
            );

            act(() => {
                result.current.handleContentHover(1);
            });

            expect(result.current.hoveredContentId).toBe(1);
        });

        it("deve limpar o ID em hover quando passar null", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: mockLastContent })
            );

            act(() => {
                result.current.handleContentHover(1);
            });

            expect(result.current.hoveredContentId).toBe(1);

            act(() => {
                result.current.handleContentHover(null);
            });

            expect(result.current.hoveredContentId).toBeNull();
        });

        it("deve atualizar o ID em hover ao passar por diferentes conteúdos", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: mockLastContent })
            );

            act(() => {
                result.current.handleContentHover(1);
            });

            expect(result.current.hoveredContentId).toBe(1);

            act(() => {
                result.current.handleContentHover(2);
            });

            expect(result.current.hoveredContentId).toBe(2);

            act(() => {
                result.current.handleContentHover(3);
            });

            expect(result.current.hoveredContentId).toBe(3);
        });
    });

    describe("getContentById", () => {
        it("deve retornar o conteúdo correto pelo ID", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: mockLastContent })
            );

            const content = result.current.getContentById(1);

            expect(content).toBeDefined();
            expect(content?.id).toBe(1);
            expect(content?.headline).toBe("Como aumentar o engajamento nas redes sociais");
        });

        it("deve retornar undefined para ID inexistente", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: mockLastContent })
            );

            const content = result.current.getContentById(999);

            expect(content).toBeUndefined();
        });

        it("deve retornar o conteúdo correto para cada ID válido", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: mockLastContent })
            );

            const content1 = result.current.getContentById(1);
            const content2 = result.current.getContentById(2);
            const content3 = result.current.getContentById(3);

            expect(content1?.platform).toBe("Instagram");
            expect(content2?.platform).toBe("LinkedIn");
            expect(content3?.platform).toBe("Twitter");
        });
    });

    describe("hasContent", () => {
        it("deve retornar true quando há conteúdo", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: mockLastContent })
            );

            expect(result.current.hasContent).toBe(true);
        });

        it("deve retornar false quando o array está vazio", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: [] })
            );

            expect(result.current.hasContent).toBe(false);
        });

        it("deve retornar true quando há apenas um item", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: [mockLastContent[0]] })
            );

            expect(result.current.hasContent).toBe(true);
        });
    });

    describe("sortedContent", () => {
        it("deve retornar array vazio quando não há conteúdo", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: [] })
            );

            expect(result.current.sortedContent).toEqual([]);
        });

        it("deve retornar conteúdo ordenado por data de criação (mais recente primeiro)", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: mockLastContent })
            );

            const dates = result.current.sortedContent.map(c => c.createdAt.getTime());
            
            for (let i = 0; i < dates.length - 1; i++) {
                expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
            }
        });

        it("deve manter todos os itens ao ordenar", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: mockLastContent })
            );

            expect(result.current.sortedContent).toHaveLength(mockLastContent.length);
            
            const ids = result.current.sortedContent.map(c => c.id);
            expect(ids).toContain(1);
            expect(ids).toContain(2);
            expect(ids).toContain(3);
        });

        it("deve criar uma nova cópia do array ao ordenar", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: mockLastContent })
            );

            expect(result.current.sortedContent).not.toBe(mockLastContent);
        });

        it("deve lidar com conteúdos com mesma data de criação", () => {
            const sameDate = new Date("2024-01-15T10:00:00");
            const contentWithSameDate = [
                {
                    ...mockLastContent[0],
                    id: 1,
                    createdAt: sameDate,
                },
                {
                    ...mockLastContent[1],
                    id: 2,
                    createdAt: sameDate,
                },
            ];

            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: contentWithSameDate })
            );

            expect(result.current.sortedContent).toHaveLength(2);
        });
    });

    describe("Estado combinado", () => {
        it("deve gerenciar selectedContentId e hoveredContentId independentemente", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: mockLastContent })
            );

            act(() => {
                result.current.handleContentClick(1);
                result.current.handleContentHover(2);
            });

            expect(result.current.selectedContentId).toBe(1);
            expect(result.current.hoveredContentId).toBe(2);
        });

        it("deve manter selectedContentId ao mudar hoveredContentId", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: mockLastContent })
            );

            act(() => {
                result.current.handleContentClick(1);
            });

            expect(result.current.selectedContentId).toBe(1);

            act(() => {
                result.current.handleContentHover(2);
            });

            expect(result.current.selectedContentId).toBe(1);
            expect(result.current.hoveredContentId).toBe(2);
        });

        it("deve manter hoveredContentId ao mudar selectedContentId", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: mockLastContent })
            );

            act(() => {
                result.current.handleContentHover(1);
            });

            expect(result.current.hoveredContentId).toBe(1);

            act(() => {
                result.current.handleContentClick(2);
            });

            expect(result.current.hoveredContentId).toBe(1);
            expect(result.current.selectedContentId).toBe(2);
        });
    });

    describe("Edge cases", () => {
        it("deve lidar com array de conteúdo com um único item", () => {
            const singleContent = [mockLastContent[0]];
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: singleContent })
            );

            expect(result.current.hasContent).toBe(true);
            expect(result.current.sortedContent).toHaveLength(1);
            expect(result.current.sortedContent[0].id).toBe(1);
        });

        it("deve lidar com muitos itens de conteúdo", () => {
            const manyContents = Array.from({ length: 100 }, (_, i) => ({
                ...mockLastContent[0],
                id: i + 1,
                createdAt: new Date(`2024-01-${(i % 28) + 1}T10:00:00`),
            }));

            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: manyContents })
            );

            expect(result.current.hasContent).toBe(true);
            expect(result.current.sortedContent).toHaveLength(100);
        });

        it("deve permitir IDs de conteúdo negativos", () => {
            const contentWithNegativeId = [
                {
                    ...mockLastContent[0],
                    id: -1,
                },
            ];

            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: contentWithNegativeId })
            );

            act(() => {
                result.current.handleContentClick(-1);
            });

            expect(result.current.selectedContentId).toBe(-1);

            const content = result.current.getContentById(-1);
            expect(content).toBeDefined();
            expect(content?.id).toBe(-1);
        });

        it("deve lidar com IDs de conteúdo muito grandes", () => {
            const contentWithLargeId = [
                {
                    ...mockLastContent[0],
                    id: 999999999,
                },
            ];

            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: contentWithLargeId })
            );

            act(() => {
                result.current.handleContentClick(999999999);
            });

            expect(result.current.selectedContentId).toBe(999999999);

            const content = result.current.getContentById(999999999);
            expect(content).toBeDefined();
            expect(content?.id).toBe(999999999);
        });
    });

    describe("Persistência de estado", () => {
        it("deve manter o estado após múltiplas interações", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: mockLastContent })
            );

            act(() => {
                result.current.handleContentClick(1);
                result.current.handleContentHover(2);
            });

            expect(result.current.selectedContentId).toBe(1);
            expect(result.current.hoveredContentId).toBe(2);

            act(() => {
                result.current.handleContentClick(3);
            });

            expect(result.current.selectedContentId).toBe(3);
            expect(result.current.hoveredContentId).toBe(2);
        });

        it("deve preservar sortedContent através de interações de estado", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: mockLastContent })
            );

            const initialSorted = result.current.sortedContent;

            act(() => {
                result.current.handleContentClick(1);
                result.current.handleContentHover(2);
            });

            expect(result.current.sortedContent).toEqual(initialSorted);
        });
    });

    describe("Retorno de funções", () => {
        it("deve retornar todas as propriedades esperadas", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: mockLastContent })
            );

            expect(result.current).toHaveProperty("selectedContentId");
            expect(result.current).toHaveProperty("hoveredContentId");
            expect(result.current).toHaveProperty("handleContentClick");
            expect(result.current).toHaveProperty("handleContentHover");
            expect(result.current).toHaveProperty("hasContent");
            expect(result.current).toHaveProperty("getContentById");
            expect(result.current).toHaveProperty("sortedContent");
        });

        it("deve retornar funções que podem ser chamadas", () => {
            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: mockLastContent })
            );

            expect(typeof result.current.handleContentClick).toBe("function");
            expect(typeof result.current.handleContentHover).toBe("function");
            expect(typeof result.current.getContentById).toBe("function");
        });
    });

    describe("Ordenação de datas", () => {
        it("deve ordenar corretamente datas do mesmo dia mas horários diferentes", () => {
            const contentsWithTimes = [
                {
                    ...mockLastContent[0],
                    id: 1,
                    createdAt: new Date("2024-01-15T08:00:00"),
                },
                {
                    ...mockLastContent[1],
                    id: 2,
                    createdAt: new Date("2024-01-15T14:00:00"),
                },
                {
                    ...mockLastContent[2],
                    id: 3,
                    createdAt: new Date("2024-01-15T20:00:00"),
                },
            ];

            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: contentsWithTimes })
            );

            expect(result.current.sortedContent[0].id).toBe(3); // 20:00
            expect(result.current.sortedContent[1].id).toBe(2); // 14:00
            expect(result.current.sortedContent[2].id).toBe(1); // 08:00
        });

        it("deve ordenar corretamente datas de anos diferentes", () => {
            const contentsWithYears = [
                {
                    ...mockLastContent[0],
                    id: 1,
                    createdAt: new Date("2022-12-31T23:59:59"),
                },
                {
                    ...mockLastContent[1],
                    id: 2,
                    createdAt: new Date("2024-01-01T00:00:00"),
                },
                {
                    ...mockLastContent[2],
                    id: 3,
                    createdAt: new Date("2023-06-15T12:00:00"),
                },
            ];

            const { result } = renderHook(() =>
                useLastContentViewModel({ lastContent: contentsWithYears })
            );

            expect(result.current.sortedContent[0].id).toBe(2); // 2024
            expect(result.current.sortedContent[1].id).toBe(3); // 2023
            expect(result.current.sortedContent[2].id).toBe(1); // 2022
        });
    });
});
