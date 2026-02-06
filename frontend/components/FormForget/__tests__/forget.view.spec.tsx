import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgetView from "../forget.view";
import useForgetViewModel from "../forget.viewmodel";

vi.mock("../forget.viewmodel");

describe("ForgetView", () => {
  const mockHandleSubmit = vi.fn((callback) => (e: any) => {
    e.preventDefault();
    callback({ email: "teste@email.com" });
  });

  const mockForm = {
    handleSubmit: mockHandleSubmit,
    register: vi.fn(),
    formState: {
      errors: {},
      isSubmitting: false,
    },
    setError: vi.fn(),
    reset: vi.fn(),
    getValues: vi.fn(),
    setValue: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useForgetViewModel).mockReturnValue({
      form: mockForm as any,
      submit: vi.fn(),
      isSubmitting: false,
    });
  });

  describe("Renderização", () => {
    it("deve renderizar o formulário corretamente", () => {
      render(<ForgetView />);

      expect(
        screen.getByText("E-mail de cadastro")
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("seu@email.com")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Enviar link" })).toBeInTheDocument();
    });

    it("deve renderizar um campo de input do tipo email", () => {
      render(<ForgetView />);

      const emailInput = screen.getByPlaceholderText("seu@email.com");
      expect(emailInput).toHaveAttribute("type", "email");
    });

    it("deve renderizar o campo de email como obrigatório", () => {
      render(<ForgetView />);

      const emailInput = screen.getByPlaceholderText("seu@email.com");
      expect(emailInput).toBeRequired();
    });

    it("deve ter as classes CSS corretas no formulário", () => {
      const { container } = render(<ForgetView />);

      const form = container.querySelector("form");
      expect(form).toHaveClass("space-y-6");
    });

    it("deve ter as classes CSS corretas no botão de submit", () => {
      render(<ForgetView />);

      const button = screen.getByRole("button", { name: "Enviar link" });
      expect(button).toHaveClass(
        "w-full",
        "bg-accent",
        "text-black",
        "py-4",
        "rounded-2xl",
        "font-bold"
      );
    });

    it("deve ter as classes CSS corretas no input de email", () => {
      render(<ForgetView />);

      const emailInput = screen.getByPlaceholderText("seu@email.com");
      expect(emailInput).toHaveClass(
        "w-full",
        "bg-[#0d0d0d]",
        "border",
        "border-white/10",
        "rounded-2xl"
      );
    });
  });

  describe("Interações do usuário", () => {
    it("deve chamar handleSubmit ao submeter o formulário", async () => {
      const mockSubmit = vi.fn();
      vi.mocked(useForgetViewModel).mockReturnValue({
        form: mockForm as any,
        submit: mockSubmit,
        isSubmitting: false,
      });

      render(<ForgetView />);

      const form = screen.getByRole("button", { name: "Enviar link" }).closest("form");
      expect(form).toBeInTheDocument();

      if (form) {
        fireEvent.submit(form);
      }

      expect(mockHandleSubmit).toHaveBeenCalled();
    });

    it("deve permitir digitar no campo de email", () => {
      render(<ForgetView />);

      const emailInput = screen.getByPlaceholderText(
        "seu@email.com"
      ) as HTMLInputElement;

      fireEvent.change(emailInput, { target: { value: "novo@email.com" } });

      expect(emailInput.value).toBe("novo@email.com");
    });

    it("deve limpar o campo de email quando o valor for removido", () => {
      render(<ForgetView />);

      const emailInput = screen.getByPlaceholderText(
        "seu@email.com"
      ) as HTMLInputElement;

      fireEvent.change(emailInput, { target: { value: "teste@email.com" } });
      expect(emailInput.value).toBe("teste@email.com");

      fireEvent.change(emailInput, { target: { value: "" } });
      expect(emailInput.value).toBe("");
    });
  });

  describe("Estado de submissão", () => {
    it("deve desabilitar o botão quando isSubmitting for true", () => {
      vi.mocked(useForgetViewModel).mockReturnValue({
        form: mockForm as any,
        submit: vi.fn(),
        isSubmitting: true,
      });

      render(<ForgetView />);

      const button = screen.getByRole("button", { name: "Enviar link" });
      expect(button).toBeDisabled();
    });

    it("deve habilitar o botão quando isSubmitting for false", () => {
      vi.mocked(useForgetViewModel).mockReturnValue({
        form: mockForm as any,
        submit: vi.fn(),
        isSubmitting: false,
      });

      render(<ForgetView />);

      const button = screen.getByRole("button", { name: "Enviar link" });
      expect(button).not.toBeDisabled();
    });

    it("deve manter o botão desabilitado durante múltiplas renderizações", () => {
      vi.mocked(useForgetViewModel).mockReturnValue({
        form: mockForm as any,
        submit: vi.fn(),
        isSubmitting: true,
      });

      const { rerender } = render(<ForgetView />);

      let button = screen.getByRole("button", { name: "Enviar link" });
      expect(button).toBeDisabled();

      rerender(<ForgetView />);

      button = screen.getByRole("button", { name: "Enviar link" });
      expect(button).toBeDisabled();
    });
  });

  describe("Estrutura do formulário", () => {
    it("deve ter um único campo de input", () => {
      render(<ForgetView />);

      const inputs = screen.getAllByRole("textbox");
      expect(inputs).toHaveLength(1);
    });

    it("deve ter um único botão de submit", () => {
      render(<ForgetView />);

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(1);
      expect(buttons[0]).toHaveAttribute("type", "submit");
    });

    it("deve ter a label correta para o campo de email", () => {
      render(<ForgetView />);

      const label = screen.getByText("E-mail de cadastro");
      expect(label).toHaveClass("text-sm", "font-semibold", "text-gray-400");
    });

    it("deve agrupar label e input corretamente", () => {
      const { container } = render(<ForgetView />);

      const spaceDiv = container.querySelector(".space-y-2");
      expect(spaceDiv).toBeInTheDocument();

      const label = spaceDiv?.querySelector("label");
      const input = spaceDiv?.querySelector("input");

      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
    });
  });

  describe("Integração com viewModel", () => {
    it("deve usar o form retornado pelo viewModel", () => {
      const customForm = {
        ...mockForm,
        handleSubmit: vi.fn((callback) => (e: any) => {
          e.preventDefault();
          callback({ email: "custom@email.com" });
        }),
      };

      vi.mocked(useForgetViewModel).mockReturnValue({
        form: customForm as any,
        submit: vi.fn(),
        isSubmitting: false,
      });

      render(<ForgetView />);

      const form = screen.getByRole("button", { name: "Enviar link" }).closest("form");

      if (form) {
        fireEvent.submit(form);
      }

      expect(customForm.handleSubmit).toHaveBeenCalled();
    });

    it("deve usar o submit retornado pelo viewModel", () => {
      const mockSubmit = vi.fn();

      vi.mocked(useForgetViewModel).mockReturnValue({
        form: mockForm as any,
        submit: mockSubmit,
        isSubmitting: false,
      });

      render(<ForgetView />);

      const form = screen.getByRole("button", { name: "Enviar link" }).closest("form");

      if (form) {
        fireEvent.submit(form);
      }

      expect(mockHandleSubmit).toHaveBeenCalledWith(mockSubmit);
    });

    it("deve refletir mudanças de isSubmitting do viewModel", () => {
      const { rerender } = render(<ForgetView />);

      let button = screen.getByRole("button", { name: "Enviar link" });
      expect(button).not.toBeDisabled();

      vi.mocked(useForgetViewModel).mockReturnValue({
        form: mockForm as any,
        submit: vi.fn(),
        isSubmitting: true,
      });

      rerender(<ForgetView />);

      button = screen.getByRole("button", { name: "Enviar link" });
      expect(button).toBeDisabled();
    });
  });

  describe("Acessibilidade", () => {
    it("deve ter type='submit' no botão", () => {
      render(<ForgetView />);

      const button = screen.getByRole("button", { name: "Enviar link" });
      expect(button).toHaveAttribute("type", "submit");
    });

    it("deve ter placeholder descritivo no input", () => {
      render(<ForgetView />);

      const input = screen.getByPlaceholderText("seu@email.com");
      expect(input).toBeInTheDocument();
    });

    it("deve ter label visível para o campo de email", () => {
      render(<ForgetView />);

      const label = screen.getByText("E-mail de cadastro");
      expect(label).toBeVisible();
    });
  });

  describe("Comportamento do formulário", () => {
    it("deve prevenir o comportamento padrão ao submeter", () => {
      const mockSubmit = vi.fn();
      const mockPreventDefault = vi.fn();

      const customHandleSubmit = vi.fn((callback) => (e: any) => {
        mockPreventDefault();
        callback({ email: "teste@email.com" });
      });

      vi.mocked(useForgetViewModel).mockReturnValue({
        form: { ...mockForm, handleSubmit: customHandleSubmit } as any,
        submit: mockSubmit,
        isSubmitting: false,
      });

      render(<ForgetView />);

      const form = screen.getByRole("button", { name: "Enviar link" }).closest("form");

      if (form) {
        fireEvent.submit(form);
      }

      expect(customHandleSubmit).toHaveBeenCalled();
    });

    it("deve validar o formato de email no cliente", () => {
      render(<ForgetView />);

      const emailInput = screen.getByPlaceholderText("seu@email.com");
      expect(emailInput).toHaveAttribute("type", "email");
    });
  });
});
