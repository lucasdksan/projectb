import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AichatView from "../aichat.view";
import { ChatMessage } from "../aichat.model";

vi.mock("../aichat.viewmodel", () => ({
  useAichatViewModel: vi.fn(),
}));

vi.mock("@/backend/schemas/aichat.schema", () => ({
  SUPPORTED_PLATFORMS: ["instagram", "facebook", "tiktok", "twitter", "linkedin", "marketplace", "ecommerce"],
}));

import { useAichatViewModel } from "../aichat.viewmodel";

describe("AichatView", () => {
  const mockViewModel = {
    messages: [] as ChatMessage[],
    input: "",
    setInput: vi.fn(),
    selectedImage: null,
    setSelectedImage: vi.fn(),
    selectedPlatform: "instagram" as const,
    setSelectedPlatform: vi.fn(),
    isFirstMessage: true,
    isLoading: false,
    isSaving: false,
    actionError: null,
    saveSuccess: null,
    messagesEndRef: { current: null },
    fileInputRef: { current: null },
    handleImageChange: vi.fn(),
    handleSubmit: vi.fn(),
    handleSaveContent: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAichatViewModel).mockReturnValue(mockViewModel);
  });

  describe("Estado inicial (sem mensagens)", () => {
    it("deve exibir tela de boas-vindas quando não há mensagens", () => {
      render(<AichatView userName="João" />);

      expect(screen.getByText("Como posso ajudar hoje?")).toBeInTheDocument();
      expect(
        screen.getByText(
          /Suba uma imagem do seu produto e peça para gerar conteúdo/
        )
      ).toBeInTheDocument();
    });

    it("deve exibir botões de sugestão", () => {
      render(<AichatView userName="João" />);

      expect(screen.getByText("Quero uma descrição...")).toBeInTheDocument();
      expect(screen.getByText("Quero uma legenda...")).toBeInTheDocument();
    });

    it("deve chamar setInput ao clicar em botão de sugestão", () => {
      render(<AichatView userName="João" />);

      const descriptionButton = screen.getByText("Quero uma descrição...");
      fireEvent.click(descriptionButton);

      expect(mockViewModel.setInput).toHaveBeenCalledWith(
        "Crie uma descrição atrativa para este produto"
      );
    });

    it("deve chamar setInput ao clicar no segundo botão de sugestão", () => {
      render(<AichatView userName="João" />);

      const captionButton = screen.getByText("Quero uma legenda...");
      fireEvent.click(captionButton);

      expect(mockViewModel.setInput).toHaveBeenCalledWith(
        "Crie uma legenda com hashtags para este produto"
      );
    });
  });

  describe("Lista de mensagens", () => {
    it("deve renderizar mensagens do usuário", () => {
      const messagesWithUser: ChatMessage[] = [
        {
          id: "1",
          role: "user",
          content: "Olá, preciso de ajuda",
        },
      ];

      vi.mocked(useAichatViewModel).mockReturnValue({
        ...mockViewModel,
        messages: messagesWithUser,
        isFirstMessage: false,
      });

      render(<AichatView userName="João" />);

      expect(screen.getByText("Olá, preciso de ajuda")).toBeInTheDocument();
    });

    it("deve renderizar mensagens do assistente", () => {
      const messagesWithAssistant: ChatMessage[] = [
        {
          id: "1",
          role: "user",
          content: "Gere conteúdo",
        },
        {
          id: "2",
          role: "assistant",
          content: "Aqui está o conteúdo gerado",
        },
      ];

      vi.mocked(useAichatViewModel).mockReturnValue({
        ...mockViewModel,
        messages: messagesWithAssistant,
        isFirstMessage: false,
      });

      render(<AichatView userName="João" />);

      expect(screen.getByText("Aqui está o conteúdo gerado")).toBeInTheDocument();
    });

    it("deve exibir imagem na mensagem do usuário quando presente", () => {
      const messagesWithImage: ChatMessage[] = [
        {
          id: "1",
          role: "user",
          content: "Gere conteúdo para esta imagem",
          image: "data:image/png;base64,test",
        },
      ];

      vi.mocked(useAichatViewModel).mockReturnValue({
        ...mockViewModel,
        messages: messagesWithImage,
        isFirstMessage: false,
      });

      const { container } = render(<AichatView userName="João" />);

      const images = container.querySelectorAll("img");
      expect(images.length).toBeGreaterThan(0);
      expect(images[0]).toHaveAttribute("src", "data:image/png;base64,test");
    });

    it("deve exibir inicial do usuário nas mensagens do usuário", () => {
      const messagesWithUser: ChatMessage[] = [
        {
          id: "1",
          role: "user",
          content: "Teste",
        },
      ];

      vi.mocked(useAichatViewModel).mockReturnValue({
        ...mockViewModel,
        messages: messagesWithUser,
        isFirstMessage: false,
      });

      render(<AichatView userName="Maria" />);

      expect(screen.getByText("M")).toBeInTheDocument();
    });

    it("deve usar 'U' como inicial padrão quando userName é null", () => {
      const messagesWithUser: ChatMessage[] = [
        {
          id: "1",
          role: "user",
          content: "Teste",
        },
      ];

      vi.mocked(useAichatViewModel).mockReturnValue({
        ...mockViewModel,
        messages: messagesWithUser,
        isFirstMessage: false,
      });

      render(<AichatView userName={null} />);

      expect(screen.getByText("U")).toBeInTheDocument();
    });

    it("deve exibir botão de salvar em mensagens do assistente com conteúdo estruturado", () => {
      const messagesWithStructured: ChatMessage[] = [
        {
          id: "1",
          role: "assistant",
          content: "Conteúdo gerado",
          structuredContent: {
            headline: "Título",
            description: "Descrição",
            cta: "CTA",
            hashtags: "#test",
          },
        },
      ];

      vi.mocked(useAichatViewModel).mockReturnValue({
        ...mockViewModel,
        messages: messagesWithStructured,
        isFirstMessage: false,
      });

      render(<AichatView userName="João" />);

      expect(screen.getByText("Salvar conteúdo")).toBeInTheDocument();
    });

    it("deve chamar handleSaveContent ao clicar em botão de salvar", () => {
      const messagesWithStructured: ChatMessage[] = [
        {
          id: "message-123",
          role: "assistant",
          content: "Conteúdo gerado",
          structuredContent: {
            headline: "Título",
            description: "Descrição",
            cta: "CTA",
            hashtags: "#test",
          },
        },
      ];

      vi.mocked(useAichatViewModel).mockReturnValue({
        ...mockViewModel,
        messages: messagesWithStructured,
        isFirstMessage: false,
      });

      render(<AichatView userName="João" />);

      const saveButton = screen.getByText("Salvar conteúdo");
      fireEvent.click(saveButton);

      expect(mockViewModel.handleSaveContent).toHaveBeenCalledWith(
        "message-123"
      );
    });

    it("deve desabilitar botão de salvar quando isSaving é true", () => {
      const messagesWithStructured: ChatMessage[] = [
        {
          id: "1",
          role: "assistant",
          content: "Conteúdo",
          structuredContent: {
            headline: "Título",
            description: "Descrição",
            cta: "CTA",
            hashtags: "#test",
          },
        },
      ];

      vi.mocked(useAichatViewModel).mockReturnValue({
        ...mockViewModel,
        messages: messagesWithStructured,
        isSaving: true,
        isFirstMessage: false,
      });

      render(<AichatView userName="João" />);

      const saveButton = screen.getByText("Salvando...");
      expect(saveButton).toBeDisabled();
    });
  });

  describe("Indicador de carregamento", () => {
    it("deve exibir indicador de carregamento quando isLoading é true", () => {
      const messages: ChatMessage[] = [
        {
          id: "1",
          role: "user",
          content: "Teste",
        },
      ];

      vi.mocked(useAichatViewModel).mockReturnValue({
        ...mockViewModel,
        messages,
        isLoading: true,
        isFirstMessage: false,
      });

      const { container } = render(<AichatView userName="João" />);

      const loadingDots = container.querySelectorAll(".loading-dot");
      expect(loadingDots).toHaveLength(3);
    });
  });

  describe("Formulário de entrada", () => {
    it("deve renderizar campo de input", () => {
      render(<AichatView userName="João" />);

      const input = screen.getByPlaceholderText(
        /Selecione uma imagem primeiro/
      );
      expect(input).toBeInTheDocument();
    });

    it("deve atualizar input quando o usuário digita", () => {
      render(<AichatView userName="João" />);

      const input = screen.getByPlaceholderText(
        /Selecione uma imagem primeiro/
      );
      fireEvent.change(input, { target: { value: "Novo texto" } });

      expect(mockViewModel.setInput).toHaveBeenCalledWith("Novo texto");
    });

    it("deve chamar handleSubmit ao submeter formulário", () => {
      const { container } = render(<AichatView userName="João" />);

      const form = container.querySelector("form");
      if (form) {
        fireEvent.submit(form);
        expect(mockViewModel.handleSubmit).toHaveBeenCalled();
      }
    });

    it("deve desabilitar botão de envio quando isLoading é true", () => {
      vi.mocked(useAichatViewModel).mockReturnValue({
        ...mockViewModel,
        isLoading: true,
      });

      const { container } = render(<AichatView userName="João" />);

      const sendButton = container.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;
      expect(sendButton).toBeDisabled();
    });

    it("deve desabilitar botão de envio quando input está vazio", () => {
      vi.mocked(useAichatViewModel).mockReturnValue({
        ...mockViewModel,
        input: "",
      });

      const { container } = render(<AichatView userName="João" />);

      const sendButton = container.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;
      expect(sendButton).toBeDisabled();
    });

    it("deve desabilitar botão de envio na primeira mensagem sem imagem", () => {
      vi.mocked(useAichatViewModel).mockReturnValue({
        ...mockViewModel,
        input: "Texto válido",
        isFirstMessage: true,
        selectedImage: null,
      });

      const { container } = render(<AichatView userName="João" />);

      const sendButton = container.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;
      expect(sendButton).toBeDisabled();
    });

    it("deve habilitar botão de envio quando há input e imagem na primeira mensagem", () => {
      vi.mocked(useAichatViewModel).mockReturnValue({
        ...mockViewModel,
        input: "Texto válido",
        isFirstMessage: true,
        selectedImage: "data:image/png;base64,test",
      });

      const { container } = render(<AichatView userName="João" />);

      const sendButton = container.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;
      expect(sendButton).not.toBeDisabled();
    });
  });

  describe("Seletor de plataforma", () => {
    it("deve renderizar seletor de plataforma", () => {
      render(<AichatView userName="João" />);

      const select = screen.getByRole("combobox");
      expect(select).toBeInTheDocument();
    });

    it("deve chamar setSelectedPlatform ao alterar plataforma", () => {
      render(<AichatView userName="João" />);

      const select = screen.getByRole("combobox") as HTMLSelectElement;
      fireEvent.change(select, { target: { value: "facebook" } });

      expect(mockViewModel.setSelectedPlatform).toHaveBeenCalledWith(
        "facebook"
      );
    });
  });

  describe("Preview de imagem selecionada", () => {
    it("deve exibir preview quando há imagem selecionada", () => {
      vi.mocked(useAichatViewModel).mockReturnValue({
        ...mockViewModel,
        selectedImage: "data:image/png;base64,test",
      });

      const { container } = render(<AichatView userName="João" />);

      const previewImage = container.querySelector(
        'img[alt="Produto"]'
      ) as HTMLImageElement;
      expect(previewImage).toBeInTheDocument();
      expect(previewImage.src).toContain("data:image/png;base64,test");
    });

    it("deve permitir remover imagem selecionada", () => {
      vi.mocked(useAichatViewModel).mockReturnValue({
        ...mockViewModel,
        selectedImage: "data:image/png;base64,test",
      });

      render(<AichatView userName="João" />);

      const removeButton = screen.getByTitle("Remover imagem");
      fireEvent.click(removeButton);

      expect(mockViewModel.setSelectedImage).toHaveBeenCalledWith(null);
    });
  });

  describe("Mensagens de feedback", () => {
    it("deve exibir mensagem de erro quando actionError está definido", () => {
      vi.mocked(useAichatViewModel).mockReturnValue({
        ...mockViewModel,
        actionError: "Erro ao processar imagem",
      });

      render(<AichatView userName="João" />);

      expect(screen.getByText("Erro ao processar imagem")).toBeInTheDocument();
    });

    it("deve exibir mensagem de sucesso quando saveSuccess está definido", () => {
      vi.mocked(useAichatViewModel).mockReturnValue({
        ...mockViewModel,
        saveSuccess: "Conteúdo salvo com sucesso!",
      });

      render(<AichatView userName="João" />);

      expect(
        screen.getByText("Conteúdo salvo com sucesso!")
      ).toBeInTheDocument();
    });
  });

  describe("Placeholder do input", () => {
    it("deve mostrar placeholder correto na primeira mensagem sem imagem", () => {
      vi.mocked(useAichatViewModel).mockReturnValue({
        ...mockViewModel,
        isFirstMessage: true,
        selectedImage: null,
      });

      render(<AichatView userName="João" />);

      expect(
        screen.getByPlaceholderText("Selecione uma imagem primeiro...")
      ).toBeInTheDocument();
    });

    it("deve mostrar placeholder correto na primeira mensagem com imagem", () => {
      vi.mocked(useAichatViewModel).mockReturnValue({
        ...mockViewModel,
        isFirstMessage: true,
        selectedImage: "data:image/png;base64,test",
      });

      render(<AichatView userName="João" />);

      expect(
        screen.getByPlaceholderText(
          "O que deseja gerar para este produto?"
        )
      ).toBeInTheDocument();
    });

    it("deve mostrar placeholder correto em mensagens subsequentes", () => {
      vi.mocked(useAichatViewModel).mockReturnValue({
        ...mockViewModel,
        isFirstMessage: false,
      });

      render(<AichatView userName="João" />);

      expect(
        screen.getByPlaceholderText(
          /Refaça, altere o tom ou peça outra variação/
        )
      ).toBeInTheDocument();
    });
  });
});
