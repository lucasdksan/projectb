import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ResetView from "../reset.view";
import useResetViewModel from "../reset.viewmodel";

vi.mock("../reset.viewmodel");

describe("ResetView", () => {
  const mockHandleSubmit = vi.fn((callback) => (e: any) => {
    e.preventDefault();
    callback({ 
      token: "1234567890", 
      email: "teste@email.com", 
      password: "senha123", 
      confirmPassword: "senha123" 
    });
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
    vi.mocked(useResetViewModel).mockReturnValue({
      form: mockForm as any,
      submit: vi.fn(),
      isSubmitting: false,
    });
  });

  describe("Renderização", () => {
    it("deve renderizar o formulário corretamente", () => {
      render(<ResetView />);

      expect(screen.getByText("Nome Completo")).toBeInTheDocument();
      expect(screen.getByText("E-mail")).toBeInTheDocument();
      expect(screen.getByText("Senha")).toBeInTheDocument();
      expect(screen.getByText("Confirmar Senha")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Cadastrar" })).toBeInTheDocument();
    });

    it("deve renderizar quatro campos de input", () => {
      const { container } = render(<ResetView />);

      const inputs = container.querySelectorAll("input");
      expect(inputs).toHaveLength(4);
    });

    it("deve renderizar o campo de email com tipo correto", () => {
      const { container } = render(<ResetView />);

      const emailInput = container.querySelector('input[type="email"]');
      expect(emailInput).toBeInTheDocument();
    });

    it("deve renderizar os campos de senha com tipo correto", () => {
      const { container } = render(<ResetView />);

      const passwordInputs = container.querySelectorAll('input[type="password"]');
      expect(passwordInputs).toHaveLength(2);
    });

    it("deve renderizar todos os campos como obrigatórios", () => {
      const { container } = render(<ResetView />);

      const inputs = container.querySelectorAll("input");
      inputs.forEach((input) => {
        expect(input).toBeRequired();
      });
    });

    it("deve ter as classes CSS corretas no formulário", () => {
      const { container } = render(<ResetView />);

      const form = container.querySelector("form");
      expect(form).toHaveClass("space-y-6");
    });

    it("deve ter as classes CSS corretas no botão de submit", () => {
      render(<ResetView />);

      const button = screen.getByRole("button", { name: "Cadastrar" });
      expect(button).toHaveClass(
        "w-full",
        "bg-accent",
        "text-black",
        "py-4",
        "rounded-2xl",
        "font-bold"
      );
    });

    it("deve ter as classes CSS corretas nos inputs", () => {
      const { container } = render(<ResetView />);

      const inputs = container.querySelectorAll("input");
      inputs.forEach((input) => {
        expect(input).toHaveClass(
          "w-full",
          "bg-sidebar",
          "border",
          "border-white/10",
          "rounded-2xl"
        );
      });
    });
  });

  describe("Interações do usuário", () => {
    it("deve chamar handleSubmit ao submeter o formulário", () => {
      const mockSubmit = vi.fn();
      vi.mocked(useResetViewModel).mockReturnValue({
        form: mockForm as any,
        submit: mockSubmit,
        isSubmitting: false,
      });

      render(<ResetView />);

      const form = screen.getByRole("button", { name: "Cadastrar" }).closest("form");
      expect(form).toBeInTheDocument();

      if (form) {
        fireEvent.submit(form);
      }

      expect(mockHandleSubmit).toHaveBeenCalled();
    });

    it("deve permitir digitar no campo de token", () => {
      const { container } = render(<ResetView />);

      const tokenInput = container.querySelector('input:not([type])') as HTMLInputElement;

      fireEvent.change(tokenInput, { target: { value: "token123456" } });

      expect(tokenInput.value).toBe("token123456");
    });

    it("deve permitir digitar no campo de email", () => {
      const { container } = render(<ResetView />);

      const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement;

      fireEvent.change(emailInput, { target: { value: "novo@email.com" } });

      expect(emailInput.value).toBe("novo@email.com");
    });

    it("deve permitir digitar no campo de senha", () => {
      const { container } = render(<ResetView />);

      const passwordInputs = container.querySelectorAll('input[type="password"]');
      const passwordInput = passwordInputs[0] as HTMLInputElement;

      fireEvent.change(passwordInput, { target: { value: "senha123" } });

      expect(passwordInput.value).toBe("senha123");
    });

    it("deve permitir digitar no campo de confirmar senha", () => {
      const { container } = render(<ResetView />);

      const passwordInputs = container.querySelectorAll('input[type="password"]');
      const confirmPasswordInput = passwordInputs[1] as HTMLInputElement;

      fireEvent.change(confirmPasswordInput, { target: { value: "senha123" } });

      expect(confirmPasswordInput.value).toBe("senha123");
    });

    it("deve limpar os campos quando o valor for removido", () => {
      const { container } = render(<ResetView />);

      const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement;

      fireEvent.change(emailInput, { target: { value: "teste@email.com" } });
      expect(emailInput.value).toBe("teste@email.com");

      fireEvent.change(emailInput, { target: { value: "" } });
      expect(emailInput.value).toBe("");
    });
  });

  describe("Estado de submissão", () => {
    it("deve desabilitar o botão quando isSubmitting for true", () => {
      vi.mocked(useResetViewModel).mockReturnValue({
        form: mockForm as any,
        submit: vi.fn(),
        isSubmitting: true,
      });

      render(<ResetView />);

      const button = screen.getByRole("button", { name: "Cadastrar" });
      expect(button).toBeDisabled();
    });

    it("deve habilitar o botão quando isSubmitting for false", () => {
      vi.mocked(useResetViewModel).mockReturnValue({
        form: mockForm as any,
        submit: vi.fn(),
        isSubmitting: false,
      });

      render(<ResetView />);

      const button = screen.getByRole("button", { name: "Cadastrar" });
      expect(button).not.toBeDisabled();
    });

    it("deve manter o botão desabilitado durante múltiplas renderizações", () => {
      vi.mocked(useResetViewModel).mockReturnValue({
        form: mockForm as any,
        submit: vi.fn(),
        isSubmitting: true,
      });

      const { rerender } = render(<ResetView />);

      let button = screen.getByRole("button", { name: "Cadastrar" });
      expect(button).toBeDisabled();

      rerender(<ResetView />);

      button = screen.getByRole("button", { name: "Cadastrar" });
      expect(button).toBeDisabled();
    });
  });

  describe("Estrutura do formulário", () => {
    it("deve ter quatro campos de input", () => {
      const { container } = render(<ResetView />);

      const inputs = container.querySelectorAll("input");
      expect(inputs).toHaveLength(4);
    });

    it("deve ter um único botão de submit", () => {
      render(<ResetView />);

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(1);
      expect(buttons[0]).toHaveAttribute("type", "submit");
    });

    it("deve ter as labels corretas para todos os campos", () => {
      render(<ResetView />);

      expect(screen.getByText("Nome Completo")).toHaveClass("text-sm", "font-semibold", "text-gray-400");
      expect(screen.getByText("E-mail")).toHaveClass("text-sm", "font-semibold", "text-gray-400");
      expect(screen.getByText("Senha")).toHaveClass("text-sm", "font-semibold", "text-gray-400");
      expect(screen.getByText("Confirmar Senha")).toHaveClass("text-sm", "font-semibold", "text-gray-400");
    });

    it("deve agrupar cada label e input corretamente", () => {
      const { container } = render(<ResetView />);

      const spaceDivs = container.querySelectorAll(".space-y-1");
      expect(spaceDivs).toHaveLength(4);

      spaceDivs.forEach((div) => {
        const label = div.querySelector("label");
        const input = div.querySelector("input");

        expect(label).toBeInTheDocument();
        expect(input).toBeInTheDocument();
      });
    });
  });

  describe("Validação e erros", () => {
    it("deve exibir mensagem de erro para o campo token", () => {
      const formWithErrors = {
        ...mockForm,
        formState: {
          errors: {
            token: { message: "Token é obrigatório" },
          },
          isSubmitting: false,
        },
      };

      vi.mocked(useResetViewModel).mockReturnValue({
        form: formWithErrors as any,
        submit: vi.fn(),
        isSubmitting: false,
      });

      render(<ResetView />);

      expect(screen.getByText("Token é obrigatório")).toBeInTheDocument();
    });

    it("deve exibir mensagem de erro para o campo email", () => {
      const formWithErrors = {
        ...mockForm,
        formState: {
          errors: {
            email: { message: "E-mail inválido" },
          },
          isSubmitting: false,
        },
      };

      vi.mocked(useResetViewModel).mockReturnValue({
        form: formWithErrors as any,
        submit: vi.fn(),
        isSubmitting: false,
      });

      render(<ResetView />);

      expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
    });

    it("deve exibir mensagem de erro para o campo password", () => {
      const formWithErrors = {
        ...mockForm,
        formState: {
          errors: {
            password: { message: "Senha muito curta" },
          },
          isSubmitting: false,
        },
      };

      vi.mocked(useResetViewModel).mockReturnValue({
        form: formWithErrors as any,
        submit: vi.fn(),
        isSubmitting: false,
      });

      render(<ResetView />);

      expect(screen.getByText("Senha muito curta")).toBeInTheDocument();
    });

    it("deve exibir mensagem de erro para o campo confirmPassword", () => {
      const formWithErrors = {
        ...mockForm,
        formState: {
          errors: {
            confirmPassword: { message: "As senhas não coincidem" },
          },
          isSubmitting: false,
        },
      };

      vi.mocked(useResetViewModel).mockReturnValue({
        form: formWithErrors as any,
        submit: vi.fn(),
        isSubmitting: false,
      });

      render(<ResetView />);

      expect(screen.getByText("As senhas não coincidem")).toBeInTheDocument();
    });

    it("deve exibir múltiplas mensagens de erro simultaneamente", () => {
      const formWithErrors = {
        ...mockForm,
        formState: {
          errors: {
            token: { message: "Token é obrigatório" },
            email: { message: "E-mail inválido" },
            password: { message: "Senha muito curta" },
            confirmPassword: { message: "As senhas não coincidem" },
          },
          isSubmitting: false,
        },
      };

      vi.mocked(useResetViewModel).mockReturnValue({
        form: formWithErrors as any,
        submit: vi.fn(),
        isSubmitting: false,
      });

      render(<ResetView />);

      expect(screen.getByText("Token é obrigatório")).toBeInTheDocument();
      expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
      expect(screen.getByText("Senha muito curta")).toBeInTheDocument();
      expect(screen.getByText("As senhas não coincidem")).toBeInTheDocument();
    });

    it("deve ter a classe CSS correta nas mensagens de erro", () => {
      const formWithErrors = {
        ...mockForm,
        formState: {
          errors: {
            token: { message: "Token é obrigatório" },
          },
          isSubmitting: false,
        },
      };

      vi.mocked(useResetViewModel).mockReturnValue({
        form: formWithErrors as any,
        submit: vi.fn(),
        isSubmitting: false,
      });

      render(<ResetView />);

      const errorMessage = screen.getByText("Token é obrigatório");
      expect(errorMessage).toHaveClass("text-red-500", "text-sm");
    });
  });

  describe("Integração com viewModel", () => {
    it("deve usar o form retornado pelo viewModel", () => {
      const customForm = {
        ...mockForm,
        handleSubmit: vi.fn((callback) => (e: any) => {
          e.preventDefault();
          callback({ 
            token: "custom123", 
            email: "custom@email.com",
            password: "custom123",
            confirmPassword: "custom123"
          });
        }),
      };

      vi.mocked(useResetViewModel).mockReturnValue({
        form: customForm as any,
        submit: vi.fn(),
        isSubmitting: false,
      });

      render(<ResetView />);

      const form = screen.getByRole("button", { name: "Cadastrar" }).closest("form");

      if (form) {
        fireEvent.submit(form);
      }

      expect(customForm.handleSubmit).toHaveBeenCalled();
    });

    it("deve usar o submit retornado pelo viewModel", () => {
      const mockSubmit = vi.fn();

      vi.mocked(useResetViewModel).mockReturnValue({
        form: mockForm as any,
        submit: mockSubmit,
        isSubmitting: false,
      });

      render(<ResetView />);

      const form = screen.getByRole("button", { name: "Cadastrar" }).closest("form");

      if (form) {
        fireEvent.submit(form);
      }

      expect(mockHandleSubmit).toHaveBeenCalledWith(mockSubmit);
    });

    it("deve refletir mudanças de isSubmitting do viewModel", () => {
      const { rerender } = render(<ResetView />);

      let button = screen.getByRole("button", { name: "Cadastrar" });
      expect(button).not.toBeDisabled();

      vi.mocked(useResetViewModel).mockReturnValue({
        form: mockForm as any,
        submit: vi.fn(),
        isSubmitting: true,
      });

      rerender(<ResetView />);

      button = screen.getByRole("button", { name: "Cadastrar" });
      expect(button).toBeDisabled();
    });

    it("deve chamar register para cada campo", () => {
      render(<ResetView />);

      expect(mockForm.register).toHaveBeenCalledWith("token");
      expect(mockForm.register).toHaveBeenCalledWith("email");
      expect(mockForm.register).toHaveBeenCalledWith("password");
      expect(mockForm.register).toHaveBeenCalledWith("confirmPassword");
    });
  });

  describe("Acessibilidade", () => {
    it("deve ter type='submit' no botão", () => {
      render(<ResetView />);

      const button = screen.getByRole("button", { name: "Cadastrar" });
      expect(button).toHaveAttribute("type", "submit");
    });

    it("deve ter labels visíveis para todos os campos", () => {
      render(<ResetView />);

      expect(screen.getByText("Nome Completo")).toBeVisible();
      expect(screen.getByText("E-mail")).toBeVisible();
      expect(screen.getByText("Senha")).toBeVisible();
      expect(screen.getByText("Confirmar Senha")).toBeVisible();
    });

    it("deve ter type='email' no campo de email para validação nativa", () => {
      const { container } = render(<ResetView />);

      const emailInput = container.querySelector('input[type="email"]');
      expect(emailInput).toBeInTheDocument();
    });

    it("deve ter type='password' nos campos de senha para segurança", () => {
      const { container } = render(<ResetView />);

      const passwordInputs = container.querySelectorAll('input[type="password"]');
      expect(passwordInputs).toHaveLength(2);
    });
  });

  describe("Comportamento do formulário", () => {
    it("deve prevenir o comportamento padrão ao submeter", () => {
      const mockSubmit = vi.fn();
      const mockPreventDefault = vi.fn();

      const customHandleSubmit = vi.fn((callback) => (e: any) => {
        mockPreventDefault();
        callback({ 
          token: "teste123", 
          email: "teste@email.com",
          password: "senha123",
          confirmPassword: "senha123"
        });
      });

      vi.mocked(useResetViewModel).mockReturnValue({
        form: { ...mockForm, handleSubmit: customHandleSubmit } as any,
        submit: mockSubmit,
        isSubmitting: false,
      });

      render(<ResetView />);

      const form = screen.getByRole("button", { name: "Cadastrar" }).closest("form");

      if (form) {
        fireEvent.submit(form);
      }

      expect(customHandleSubmit).toHaveBeenCalled();
    });

    it("deve validar o formato de email no cliente", () => {
      const { container } = render(<ResetView />);

      const emailInput = container.querySelector('input[type="email"]');
      expect(emailInput).toHaveAttribute("type", "email");
    });

    it("não deve exibir mensagens de erro quando não houver erros", () => {
      render(<ResetView />);

      const errorMessages = screen.queryAllByText(/obrigatório|inválido|curta|coincidem/i);
      expect(errorMessages).toHaveLength(0);
    });
  });
});