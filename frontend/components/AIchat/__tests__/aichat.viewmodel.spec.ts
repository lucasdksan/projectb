import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useAichatViewModel } from "../aichat.viewmodel";

vi.mock("@/app/(private)/dashboard/contentAI/aichat.action", () => ({
  sendMessageWithContextAction: vi.fn(),
}));

vi.mock("@/app/(private)/dashboard/contentAI/aicontent.action", () => ({
  saveContentAction: vi.fn(),
}));

let mockUuidCounter = 0;
vi.stubGlobal("crypto", {
  randomUUID: () => `mock-uuid-${mockUuidCounter++}`,
});

import { sendMessageWithContextAction } from "@/app/(private)/dashboard/contentAI/aichat.action";
import { saveContentAction } from "@/app/(private)/dashboard/contentAI/aicontent.action";

describe("useAichatViewModel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUuidCounter = 0;
  });

  describe("Estado inicial", () => {
    it("deve inicializar com valores padrão corretos", () => {
      const { result } = renderHook(() => useAichatViewModel());

      expect(result.current.messages).toEqual([]);
      expect(result.current.input).toBe("");
      expect(result.current.selectedImage).toBeNull();
      expect(result.current.selectedPlatform).toBe("instagram");
      expect(result.current.isFirstMessage).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSaving).toBe(false);
      expect(result.current.actionError).toBeNull();
      expect(result.current.saveSuccess).toBeNull();
    });
  });

  describe("setInput", () => {
    it("deve atualizar o input", () => {
      const { result } = renderHook(() => useAichatViewModel());

      act(() => {
        result.current.setInput("Novo texto");
      });

      expect(result.current.input).toBe("Novo texto");
    });
  });

  describe("setSelectedImage", () => {
    it("deve atualizar a imagem selecionada", () => {
      const { result } = renderHook(() => useAichatViewModel());

      act(() => {
        result.current.setSelectedImage("data:image/png;base64,test");
      });

      expect(result.current.selectedImage).toBe("data:image/png;base64,test");
    });

    it("deve permitir remover a imagem selecionada", () => {
      const { result } = renderHook(() => useAichatViewModel());

      act(() => {
        result.current.setSelectedImage("data:image/png;base64,test");
      });

      expect(result.current.selectedImage).toBe("data:image/png;base64,test");

      act(() => {
        result.current.setSelectedImage(null);
      });

      expect(result.current.selectedImage).toBeNull();
    });
  });

  describe("setSelectedPlatform", () => {
    it("deve atualizar a plataforma selecionada", () => {
      const { result } = renderHook(() => useAichatViewModel());

      act(() => {
        result.current.setSelectedPlatform("facebook");
      });

      expect(result.current.selectedPlatform).toBe("facebook");
    });
  });

  describe("handleImageChange", () => {
    it("deve processar arquivo de imagem e converter para base64", async () => {
      const { result } = renderHook(() => useAichatViewModel());

      const mockFile = new File(["test"], "test.png", { type: "image/png" });
      const mockEvent = {
        target: {
          files: [mockFile],
        },
      } as any;

      const mockReadAsDataURL = vi.fn();
      const MockFileReader = vi.fn(function (this: any) {
        this.readAsDataURL = mockReadAsDataURL;
        this.result = "data:image/png;base64,mockbase64";
        this.onloadend = null;
      });

      vi.stubGlobal("FileReader", MockFileReader);

      act(() => {
        result.current.handleImageChange(mockEvent);
        const instance = MockFileReader.mock.instances[0];
        if (instance.onloadend) {
          instance.onloadend({} as any);
        }
      });

      await waitFor(() => {
        expect(result.current.selectedImage).toBe(
          "data:image/png;base64,mockbase64"
        );
      });

      vi.unstubAllGlobals();
    });
  });

  describe("isFirstMessage", () => {
    it("deve retornar true quando não há mensagens", () => {
      const { result } = renderHook(() => useAichatViewModel());

      expect(result.current.isFirstMessage).toBe(true);
    });

    it("deve retornar false após enviar primeira mensagem", async () => {
      const { result } = renderHook(() => useAichatViewModel());

      vi.mocked(sendMessageWithContextAction).mockResolvedValue({
        success: true,
        data: {
          message: "Resposta da IA",
          structuredContent: undefined,
        },
      } as any);

      const mockEvent = {
        preventDefault: vi.fn(),
        currentTarget: document.createElement("form"),
      } as any;

      act(() => {
        result.current.setInput("Teste");
        result.current.setSelectedImage("data:image/png;base64,test");
      });

      await act(async () => {
        result.current.handleSubmit(mockEvent);
      });

      await waitFor(() => {
        expect(result.current.isFirstMessage).toBe(false);
      });
    });
  });

  describe("handleSubmit", () => {
    it("deve impedir envio na primeira mensagem sem imagem", () => {
      const { result } = renderHook(() => useAichatViewModel());

      const mockEvent = {
        preventDefault: vi.fn(),
        currentTarget: document.createElement("form"),
      } as any;

      act(() => {
        result.current.setInput("Teste sem imagem");
      });

      act(() => {
        result.current.handleSubmit(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(sendMessageWithContextAction).not.toHaveBeenCalled();
      expect(result.current.messages).toHaveLength(0);
    });

    it("deve enviar mensagem com imagem na primeira vez", async () => {
      const { result } = renderHook(() => useAichatViewModel());

      vi.mocked(sendMessageWithContextAction).mockResolvedValue({
        success: true,
        data: {
          message: "Conteúdo gerado pela IA",
          structuredContent: {
            headline: "Título",
            description: "Descrição",
            cta: "CTA",
            hashtags: "#test",
          },
        },
      } as any);

      const mockEvent = {
        preventDefault: vi.fn(),
        currentTarget: document.createElement("form"),
      } as any;

      act(() => {
        result.current.setInput("Gere conteúdo para este produto");
        result.current.setSelectedImage("data:image/png;base64,test");
      });

      await act(async () => {
        result.current.handleSubmit(mockEvent);
      });

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(2);
        expect(result.current.messages[0].role).toBe("user");
        expect(result.current.messages[0].content).toBe(
          "Gere conteúdo para este produto"
        );
        expect(result.current.messages[1].role).toBe("assistant");
        expect(result.current.messages[1].structuredContent).toBeDefined();
      });
    });

    it("deve limpar input e imagem após envio", async () => {
      const { result } = renderHook(() => useAichatViewModel());

      vi.mocked(sendMessageWithContextAction).mockResolvedValue({
        success: true,
        data: {
          message: "Resposta",
          structuredContent: undefined,
        },
      } as any);

      const mockEvent = {
        preventDefault: vi.fn(),
        currentTarget: document.createElement("form"),
      } as any;

      act(() => {
        result.current.setInput("Teste");
        result.current.setSelectedImage("data:image/png;base64,test");
      });

      await act(async () => {
        result.current.handleSubmit(mockEvent);
      });

      await waitFor(() => {
        expect(result.current.input).toBe("");
        expect(result.current.selectedImage).toBeNull();
      });
    });

    it("deve adicionar mensagem do usuário imediatamente", async () => {
      const { result } = renderHook(() => useAichatViewModel());

      vi.mocked(sendMessageWithContextAction).mockResolvedValue({
        success: true,
        data: { message: "Resposta", structuredContent: undefined },
      } as any);

      const mockEvent = {
        preventDefault: vi.fn(),
        currentTarget: document.createElement("form"),
      } as any;

      act(() => {
        result.current.setInput("Minha pergunta");
        result.current.setSelectedImage("data:image/png;base64,test");
      });

      await act(async () => {
        result.current.handleSubmit(mockEvent);
      });

      expect(result.current.messages[0]).toMatchObject({
        role: "user",
        content: "Minha pergunta",
        image: "data:image/png;base64,test",
      });
      expect(result.current.messages[0].id).toBeDefined();
    });

    it("deve definir erro quando a action falhar", async () => {
      const { result } = renderHook(() => useAichatViewModel());

      vi.mocked(sendMessageWithContextAction).mockResolvedValue({
        success: false,
        errors: {
          global: ["Erro ao processar imagem"],
        },
      } as any);

      const mockEvent = {
        preventDefault: vi.fn(),
        currentTarget: document.createElement("form"),
      } as any;

      act(() => {
        result.current.setInput("Teste");
        result.current.setSelectedImage("data:image/png;base64,test");
      });

      await act(async () => {
        result.current.handleSubmit(mockEvent);
      });

      await waitFor(() => {
        expect(result.current.actionError).toBe("Erro ao processar imagem");
      });
    });

    it("deve limpar erros anteriores ao enviar nova mensagem", async () => {
      const { result } = renderHook(() => useAichatViewModel());

      vi.mocked(sendMessageWithContextAction)
        .mockResolvedValueOnce({
          success: false,
          errors: { global: ["Erro anterior"] },
        } as any)
        .mockResolvedValueOnce({
          success: true,
          data: { message: "Sucesso", structuredContent: undefined },
        } as any);

      const mockEvent = {
        preventDefault: vi.fn(),
        currentTarget: document.createElement("form"),
      } as any;

      act(() => {
        result.current.setInput("Teste 1");
        result.current.setSelectedImage("data:image/png;base64,test");
      });

      await act(async () => {
        result.current.handleSubmit(mockEvent);
      });

      await waitFor(() => {
        expect(result.current.actionError).toBe("Erro anterior");
      });

      act(() => {
        result.current.setInput("Teste 2");
        result.current.setSelectedImage("data:image/png;base64,test");
      });

      await act(async () => {
        result.current.handleSubmit(mockEvent);
      });

      await waitFor(() => {
        expect(result.current.actionError).toBeNull();
      });
    });
  });

  describe("handleSaveContent", () => {
    it("deve salvar conteúdo estruturado com sucesso", async () => {
      const { result } = renderHook(() => useAichatViewModel());

      const mockStructuredContent = {
        headline: "Título",
        description: "Descrição",
        cta: "CTA",
        hashtags: "#test",
      };

      vi.mocked(sendMessageWithContextAction).mockResolvedValue({
        success: true,
        data: {
          message: "Resposta",
          structuredContent: mockStructuredContent,
        },
      } as any);

      const mockEvent = {
        preventDefault: vi.fn(),
        currentTarget: document.createElement("form"),
      } as any;

      act(() => {
        result.current.setInput("Teste");
        result.current.setSelectedImage("data:image/png;base64,test");
      });

      await act(async () => {
        result.current.handleSubmit(mockEvent);
      });

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(2);
      });

      vi.mocked(saveContentAction).mockResolvedValue({
        success: true,
      } as any);

      const messageId = result.current.messages[1].id;

      await act(async () => {
        result.current.handleSaveContent(messageId);
      });

      await waitFor(() => {
        expect(saveContentAction).toHaveBeenCalledWith(mockStructuredContent);
        expect(result.current.saveSuccess).toBe("Conteúdo salvo com sucesso!");
      });
    });

    it("deve exibir erro quando mensagem não tem conteúdo estruturado", () => {
      const { result } = renderHook(() => useAichatViewModel());

      act(() => {
        result.current.handleSaveContent("id-inexistente");
      });

      expect(result.current.actionError).toBe(
        "Conteúdo não disponível para salvar."
      );
    });

    it("deve exibir erro quando saveContentAction falhar", async () => {
      const { result } = renderHook(() => useAichatViewModel());

      const mockStructuredContent = {
        headline: "Título",
        description: "Descrição",
        cta: "CTA",
        hashtags: "#test",
      };

      vi.mocked(sendMessageWithContextAction).mockResolvedValue({
        success: true,
        data: {
          message: "Resposta",
          structuredContent: mockStructuredContent,
        },
      } as any);

      const mockEvent = {
        preventDefault: vi.fn(),
        currentTarget: document.createElement("form"),
      } as any;

      act(() => {
        result.current.setInput("Teste");
        result.current.setSelectedImage("data:image/png;base64,test");
      });

      await act(async () => {
        result.current.handleSubmit(mockEvent);
      });

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(2);
      });

      vi.mocked(saveContentAction).mockResolvedValue({
        success: false,
        errors: { global: ["Erro ao salvar no banco"] },
      } as any);

      const messageId = result.current.messages[1].id;

      await act(async () => {
        result.current.handleSaveContent(messageId);
      });

      await waitFor(() => {
        expect(result.current.actionError).toBe("Erro ao salvar no banco");
      });
    });
  });
});
