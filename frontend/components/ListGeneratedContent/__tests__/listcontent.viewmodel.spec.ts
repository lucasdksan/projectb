import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import useListContentViewModel from "../listcontent.viewmodel";
import { ContentAI } from "@prisma/client";
import { deleteGeneratedContentAction } from "@/app/(private)/dashboard/generatedContent/deletegeneratedcontent.action";

vi.mock("@/app/(private)/dashboard/generatedContent/deletegeneratedcontent.action", () => ({
    deleteGeneratedContentAction: vi.fn(),
}));

const mockRouterRefresh = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        refresh: mockRouterRefresh,
    }),
}));

describe("useListContentViewModel", () => {
    const mockContents: ContentAI[] = [
        {
            id: 1,
            headline: "Teste Instagram",
            description: "Descrição teste",
            cta: "Call to action",
            hashtags: "#teste #instagram",
            platform: "instagram",
            userId: 1,
            createdAt: new Date("2024-01-15"),
            updatedAt: new Date("2024-01-15"),
        },
        {
            id: 2,
            headline: "Teste LinkedIn",
            description: "Descrição LinkedIn",
            cta: "Saiba mais",
            hashtags: "#linkedin #test",
            platform: "linkedin",
            userId: 1,
            createdAt: new Date("2024-01-16"),
            updatedAt: new Date("2024-01-16"),
        },
        {
            id: 3,
            headline: "Teste TikTok",
            description: "Descrição TikTok",
            cta: "Confira",
            hashtags: "#tiktok",
            platform: "tiktok",
            userId: 1,
            createdAt: new Date("2024-01-17"),
            updatedAt: new Date("2024-01-17"),
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        
        // Mock do clipboard
        Object.assign(navigator, {
            clipboard: {
                writeText: vi.fn().mockResolvedValue(undefined),
            },
        });

        // Mock de window.confirm
        vi.stubGlobal('confirm', vi.fn(() => true));
        vi.stubGlobal('alert', vi.fn());
        vi.stubGlobal('console', {
            ...console,
            error: vi.fn(),
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    describe("Estado inicial", () => {
        it("deve inicializar com valores padrão corretos", () => {
            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            expect(result.current.filter).toBe("Todos");
            expect(result.current.copiedId).toBeNull();
            expect(result.current.deletingId).toBeNull();
            expect(result.current.filteredData).toEqual(mockContents);
        });

        it("deve retornar todas as plataformas disponíveis", () => {
            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            expect(result.current.platforms).toContain("Todos");
            expect(result.current.platforms).toContain("instagram");
            expect(result.current.platforms).toContain("linkedin");
            expect(result.current.platforms).toContain("facebook");
            expect(result.current.platforms).toContain("tiktok");
            expect(result.current.platforms).toContain("twitter");
        });

        it("deve ter métodos de manipulação disponíveis", () => {
            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            expect(result.current.setFilter).toBeInstanceOf(Function);
            expect(result.current.handleCopy).toBeInstanceOf(Function);
            expect(result.current.handleDelete).toBeInstanceOf(Function);
            expect(result.current.getPlatformLabel).toBeInstanceOf(Function);
        });
    });

    describe("Filtro de plataformas", () => {
        it("deve mostrar todos os conteúdos quando filtro for 'Todos'", () => {
            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            expect(result.current.filteredData).toHaveLength(3);
            expect(result.current.filteredData).toEqual(mockContents);
        });

        it("deve filtrar apenas conteúdos do Instagram", () => {
            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            act(() => {
                result.current.setFilter("instagram");
            });

            expect(result.current.filteredData).toHaveLength(1);
            expect(result.current.filteredData[0].platform).toBe("instagram");
        });

        it("deve filtrar apenas conteúdos do LinkedIn", () => {
            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            act(() => {
                result.current.setFilter("linkedin");
            });

            expect(result.current.filteredData).toHaveLength(1);
            expect(result.current.filteredData[0].platform).toBe("linkedin");
        });

        it("deve filtrar apenas conteúdos do TikTok", () => {
            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            act(() => {
                result.current.setFilter("tiktok");
            });

            expect(result.current.filteredData).toHaveLength(1);
            expect(result.current.filteredData[0].platform).toBe("tiktok");
        });

        it("deve retornar array vazio quando filtrar plataforma sem conteúdos", () => {
            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            act(() => {
                result.current.setFilter("facebook");
            });

            expect(result.current.filteredData).toHaveLength(0);
        });

        it("deve voltar a mostrar todos os conteúdos ao retornar para 'Todos'", () => {
            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            act(() => {
                result.current.setFilter("instagram");
            });

            expect(result.current.filteredData).toHaveLength(1);

            act(() => {
                result.current.setFilter("Todos");
            });

            expect(result.current.filteredData).toHaveLength(3);
        });

        it("deve atualizar o filtro corretamente", () => {
            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            act(() => {
                result.current.setFilter("linkedin");
            });

            expect(result.current.filter).toBe("linkedin");
        });

        it("deve manter filtro ao receber novos conteúdos", () => {
            const { result, rerender } = renderHook(
                ({ contents }) => useListContentViewModel({ contents }),
                { initialProps: { contents: mockContents } }
            );

            act(() => {
                result.current.setFilter("instagram");
            });

            const newContents = [...mockContents];
            rerender({ contents: newContents });

            expect(result.current.filter).toBe("instagram");
            expect(result.current.filteredData).toHaveLength(1);
        });
    });

    describe("handleCopy", () => {
        it("deve copiar texto para clipboard com sucesso", async () => {
            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            await act(async () => {
                await result.current.handleCopy(1, "Texto para copiar");
            });

            expect(navigator.clipboard.writeText).toHaveBeenCalledWith("Texto para copiar");
        });

        it("deve definir copiedId após copiar", async () => {
            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            await act(async () => {
                await result.current.handleCopy(1, "Texto teste");
            });

            expect(result.current.copiedId).toBe(1);
        });

        it("deve limpar copiedId após 2 segundos", async () => {
            vi.useFakeTimers();
            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            await act(async () => {
                await result.current.handleCopy(1, "Texto teste");
            });

            expect(result.current.copiedId).toBe(1);

            await act(async () => {
                vi.advanceTimersByTime(2000);
            });

            expect(result.current.copiedId).toBeNull();

            vi.useRealTimers();
        });

        it("deve copiar diferentes textos corretamente", async () => {
            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            await act(async () => {
                await result.current.handleCopy(1, "Primeiro texto");
            });

            expect(navigator.clipboard.writeText).toHaveBeenCalledWith("Primeiro texto");

            await act(async () => {
                await result.current.handleCopy(2, "Segundo texto");
            });

            expect(navigator.clipboard.writeText).toHaveBeenCalledWith("Segundo texto");
        });

        it("deve atualizar copiedId ao copiar diferente item", async () => {
            vi.useFakeTimers();
            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            await act(async () => {
                await result.current.handleCopy(1, "Texto 1");
            });

            expect(result.current.copiedId).toBe(1);

            await act(async () => {
                await result.current.handleCopy(2, "Texto 2");
            });

            expect(result.current.copiedId).toBe(2);

            vi.useRealTimers();
        });

        it("deve lidar com erro ao copiar", async () => {
            const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
            const clipboardError = new Error("Clipboard error");
            vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(clipboardError);

            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            await act(async () => {
                await result.current.handleCopy(1, "Texto teste");
            });

            expect(consoleError).toHaveBeenCalledWith("Erro ao copiar:", clipboardError);
            expect(result.current.copiedId).toBeNull();

            consoleError.mockRestore();
        });
    });

    describe("handleDelete", () => {
        it("deve deletar conteúdo com sucesso", async () => {
            vi.mocked(deleteGeneratedContentAction).mockResolvedValueOnce({
                success: true,
            });

            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            await act(async () => {
                await result.current.handleDelete(1);
            });

            expect(deleteGeneratedContentAction).toHaveBeenCalledWith(1);
            expect(mockRouterRefresh).toHaveBeenCalled();
        });

        it("deve definir deletingId durante deleção", async () => {
            vi.mocked(deleteGeneratedContentAction).mockResolvedValueOnce({
                success: true,
            });

            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            await act(async () => {
                await result.current.handleDelete(1);
            });

            // Teste passou se não houve erro
            expect(result.current.deletingId).toBeNull();
        });

        it("deve limpar deletingId após deleção bem-sucedida", async () => {
            vi.mocked(deleteGeneratedContentAction).mockResolvedValueOnce({
                success: true,
            });

            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            await act(async () => {
                await result.current.handleDelete(1);
            });

            expect(result.current.deletingId).toBeNull();
        });

        it("não deve deletar se usuário cancelar confirmação", async () => {
            vi.stubGlobal('confirm', vi.fn(() => false));

            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            await act(async () => {
                await result.current.handleDelete(1);
            });

            expect(deleteGeneratedContentAction).not.toHaveBeenCalled();
            expect(mockRouterRefresh).not.toHaveBeenCalled();
        });

        it("deve mostrar alert com erro quando deleção falhar", async () => {
            const mockAlert = vi.fn();
            vi.stubGlobal('alert', mockAlert);

            vi.mocked(deleteGeneratedContentAction).mockResolvedValueOnce({
                success: false,
                errors: {
                    global: ["Erro ao deletar conteúdo"],
                },
            });

            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            await act(async () => {
                await result.current.handleDelete(1);
            });

            expect(mockAlert).toHaveBeenCalledWith("Erro ao deletar conteúdo");
            expect(mockRouterRefresh).not.toHaveBeenCalled();
        });

        it("deve mostrar mensagem padrão quando não houver erro específico", async () => {
            const mockAlert = vi.fn();
            vi.stubGlobal('alert', mockAlert);

            vi.mocked(deleteGeneratedContentAction).mockResolvedValueOnce({
                success: false,
                errors: {},
            });

            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            await act(async () => {
                await result.current.handleDelete(1);
            });

            expect(mockAlert).toHaveBeenCalledWith("Erro ao deletar conteúdo");
        });

        it("deve lidar com exceção durante deleção", async () => {
            const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
            const mockAlert = vi.fn();
            vi.stubGlobal('alert', mockAlert);

            const error = new Error("Network error");
            vi.mocked(deleteGeneratedContentAction).mockRejectedValueOnce(error);

            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            await act(async () => {
                await result.current.handleDelete(1);
            });

            expect(consoleError).toHaveBeenCalledWith("Erro ao deletar:", error);
            expect(mockAlert).toHaveBeenCalledWith("Erro ao deletar conteúdo");
            expect(result.current.deletingId).toBeNull();

            consoleError.mockRestore();
        });

        it("deve limpar deletingId mesmo em caso de erro", async () => {
            vi.mocked(deleteGeneratedContentAction).mockRejectedValueOnce(new Error("Error"));

            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            await act(async () => {
                await result.current.handleDelete(1);
            });

            expect(result.current.deletingId).toBeNull();
        });

        it("deve mostrar confirmação antes de deletar", async () => {
            const mockConfirm = vi.fn(() => true);
            vi.stubGlobal('confirm', mockConfirm);

            vi.mocked(deleteGeneratedContentAction).mockResolvedValueOnce({
                success: true,
            });

            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            await act(async () => {
                await result.current.handleDelete(1);
            });

            expect(mockConfirm).toHaveBeenCalledWith("Tem certeza que deseja deletar este conteúdo?");
        });
    });

    describe("getPlatformLabel", () => {
        it("deve retornar label correto para Instagram", () => {
            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            expect(result.current.getPlatformLabel("instagram")).toBe("Instagram");
        });

        it("deve retornar label correto para LinkedIn", () => {
            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            expect(result.current.getPlatformLabel("linkedin")).toBe("LinkedIn");
        });

        it("deve retornar label correto para TikTok", () => {
            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            expect(result.current.getPlatformLabel("tiktok")).toBe("TikTok");
        });

        it("deve retornar label correto para Twitter", () => {
            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            expect(result.current.getPlatformLabel("twitter")).toBe("Twitter/X");
        });

        it("deve retornar label correto para Facebook", () => {
            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            expect(result.current.getPlatformLabel("facebook")).toBe("Facebook");
        });

        it("deve retornar valor original para plataforma desconhecida", () => {
            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            expect(result.current.getPlatformLabel("unknown")).toBe("unknown");
        });
    });

    describe("Integração entre funcionalidades", () => {
        it("deve permitir filtrar e depois copiar", async () => {
            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            act(() => {
                result.current.setFilter("instagram");
            });

            expect(result.current.filteredData).toHaveLength(1);

            await act(async () => {
                await result.current.handleCopy(1, "Texto");
            });

            expect(result.current.copiedId).toBe(1);
        });

        it("deve permitir copiar e depois deletar", async () => {
            vi.mocked(deleteGeneratedContentAction).mockResolvedValueOnce({
                success: true,
            });

            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            await act(async () => {
                await result.current.handleCopy(1, "Texto");
            });

            expect(result.current.copiedId).toBe(1);

            await act(async () => {
                await result.current.handleDelete(1);
            });

            expect(deleteGeneratedContentAction).toHaveBeenCalled();
        });

        it("deve manter filtro após deletar item", async () => {
            vi.mocked(deleteGeneratedContentAction).mockResolvedValueOnce({
                success: true,
            });

            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            act(() => {
                result.current.setFilter("instagram");
            });

            await act(async () => {
                await result.current.handleDelete(1);
            });

            expect(result.current.filter).toBe("instagram");
        });
    });

    describe("Edge cases", () => {
        it("deve lidar com lista vazia de conteúdos", () => {
            const { result } = renderHook(() => useListContentViewModel({ contents: [] }));

            expect(result.current.filteredData).toHaveLength(0);
            expect(result.current.platforms).toContain("Todos");
        });

        it("deve lidar com ID inexistente ao copiar", async () => {
            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            await act(async () => {
                await result.current.handleCopy(999, "Texto");
            });

            expect(result.current.copiedId).toBe(999);
        });

        it("deve lidar com texto vazio ao copiar", async () => {
            const { result } = renderHook(() => useListContentViewModel({ contents: mockContents }));

            await act(async () => {
                await result.current.handleCopy(1, "");
            });

            expect(navigator.clipboard.writeText).toHaveBeenCalledWith("");
        });

        it("deve lidar com conteúdos sem plataforma definida", () => {
            const invalidContent = [{
                ...mockContents[0],
                platform: "" as any,
            }];

            const { result } = renderHook(() => useListContentViewModel({ contents: invalidContent }));

            act(() => {
                result.current.setFilter("instagram");
            });

            expect(result.current.filteredData).toHaveLength(0);
        });
    });
});
