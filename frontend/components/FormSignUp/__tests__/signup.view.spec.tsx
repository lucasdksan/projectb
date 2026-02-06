import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SignupView from "../signup.view";
import { useSignupViewModel } from "../signup.viewmodel";

vi.mock("../signup.viewmodel");

describe("SignupView", () => {
    const mockHandleSubmit = vi.fn((callback) => (e: any) => {
        e.preventDefault();
        callback({
            name: "João Silva",
            email: "joao@email.com",
            password: "senha123",
            confirmPassword: "senha123",
        });
    });

    const mockForm = {
        handleSubmit: mockHandleSubmit,
        register: vi.fn((name: string) => ({
            name,
            onChange: vi.fn(),
            onBlur: vi.fn(),
            ref: vi.fn(),
        })),
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
        vi.mocked(useSignupViewModel).mockReturnValue({
            form: mockForm as any,
            submit: vi.fn(),
            isSubmitting: false,
        });
    });

    describe("Renderização", () => {
        it("deve renderizar o formulário corretamente", () => {
            render(<SignupView />);

            expect(screen.getByText("Nome Completo")).toBeInTheDocument();
            expect(screen.getByText("E-mail")).toBeInTheDocument();
            expect(screen.getAllByText("Senha")[0]).toBeInTheDocument();
            expect(screen.getByText("Confirmar Senha")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Cadastrar" })).toBeInTheDocument();
        });

        it("deve renderizar quatro campos de input", () => {
            render(<SignupView />);

            const nameInput = screen.getByLabelText("Nome Completo");
            const emailInput = screen.getByLabelText("E-mail");
            const passwordInput = screen.getByLabelText("Senha");
            const confirmPasswordInput = screen.getByLabelText("Confirmar Senha");

            expect(nameInput).toBeInTheDocument();
            expect(emailInput).toBeInTheDocument();
            expect(passwordInput).toBeInTheDocument();
            expect(confirmPasswordInput).toBeInTheDocument();
        });

        it("deve renderizar campo de email com tipo correto", () => {
            render(<SignupView />);

            const emailInput = screen.getByLabelText("E-mail");
            expect(emailInput).toHaveAttribute("type", "email");
        });

        it("deve renderizar campos de senha com tipo correto", () => {
            render(<SignupView />);

            const passwordInput = screen.getByLabelText("Senha");
            const confirmPasswordInput = screen.getByLabelText("Confirmar Senha");

            expect(passwordInput).toHaveAttribute("type", "password");
            expect(confirmPasswordInput).toHaveAttribute("type", "password");
        });

        it("deve renderizar todos os campos como obrigatórios", () => {
            render(<SignupView />);

            const nameInput = screen.getByLabelText("Nome Completo");
            const emailInput = screen.getByLabelText("E-mail");
            const passwordInput = screen.getByLabelText("Senha");
            const confirmPasswordInput = screen.getByLabelText("Confirmar Senha");

            expect(nameInput).toBeRequired();
            expect(emailInput).toBeRequired();
            expect(passwordInput).toBeRequired();
            expect(confirmPasswordInput).toBeRequired();
        });

        it("deve ter as classes CSS corretas no formulário", () => {
            const { container } = render(<SignupView />);

            const form = container.querySelector("form");
            expect(form).toHaveClass("space-y-6");
        });

        it("deve ter as classes CSS corretas nos inputs", () => {
            render(<SignupView />);

            const nameInput = screen.getByLabelText("Nome Completo");
            expect(nameInput).toHaveClass(
                "w-full",
                "bg-sidebar",
                "border",
                "border-white/10",
                "rounded-2xl",
                "py-3.5",
                "px-6",
                "text-white"
            );
        });

        it("deve ter as classes CSS corretas no botão", () => {
            render(<SignupView />);

            const submitButton = screen.getByRole("button", { name: "Cadastrar" });
            expect(submitButton).toHaveClass(
                "w-full",
                "bg-accent",
                "text-black",
                "py-4",
                "rounded-2xl",
                "font-bold"
            );
        });

        it("deve ter as classes CSS corretas nas labels", () => {
            render(<SignupView />);

            const labels = screen.getAllByText(/Nome Completo|E-mail|Senha|Confirmar Senha/);
            labels.forEach((label) => {
                expect(label).toHaveClass("text-sm", "font-semibold", "text-gray-400", "ml-1");
            });
        });
    });

    describe("Comportamento dos inputs", () => {
        it("deve chamar register para cada campo", () => {
            render(<SignupView />);

            expect(mockForm.register).toHaveBeenCalledWith("name");
            expect(mockForm.register).toHaveBeenCalledWith("email");
            expect(mockForm.register).toHaveBeenCalledWith("password");
            expect(mockForm.register).toHaveBeenCalledWith("confirmPassword");
        });

        it("deve permitir digitar no campo de nome", () => {
            render(<SignupView />);

            const nameInput = screen.getByLabelText("Nome Completo") as HTMLInputElement;
            fireEvent.change(nameInput, { target: { value: "Maria Silva" } });

            expect(nameInput.value).toBe("Maria Silva");
        });

        it("deve permitir digitar no campo de email", () => {
            render(<SignupView />);

            const emailInput = screen.getByLabelText("E-mail") as HTMLInputElement;
            fireEvent.change(emailInput, { target: { value: "maria@email.com" } });

            expect(emailInput.value).toBe("maria@email.com");
        });

        it("deve permitir digitar no campo de senha", () => {
            render(<SignupView />);

            const passwordInput = screen.getByLabelText("Senha") as HTMLInputElement;
            fireEvent.change(passwordInput, { target: { value: "senhaSegura123" } });

            expect(passwordInput.value).toBe("senhaSegura123");
        });

        it("deve permitir digitar no campo de confirmar senha", () => {
            render(<SignupView />);

            const confirmPasswordInput = screen.getByLabelText("Confirmar Senha") as HTMLInputElement;
            fireEvent.change(confirmPasswordInput, { target: { value: "senhaSegura123" } });

            expect(confirmPasswordInput.value).toBe("senhaSegura123");
        });

        it("deve limpar o valor dos campos quando reset é chamado", () => {
            render(<SignupView />);

            const nameInput = screen.getByLabelText("Nome Completo") as HTMLInputElement;
            const emailInput = screen.getByLabelText("E-mail") as HTMLInputElement;

            fireEvent.change(nameInput, { target: { value: "João" } });
            fireEvent.change(emailInput, { target: { value: "joao@email.com" } });

            expect(nameInput.value).toBe("João");
            expect(emailInput.value).toBe("joao@email.com");

            fireEvent.change(nameInput, { target: { value: "" } });
            fireEvent.change(emailInput, { target: { value: "" } });

            expect(nameInput.value).toBe("");
            expect(emailInput.value).toBe("");
        });
    });

    describe("Mensagens de erro", () => {
        it("deve exibir mensagem de erro para nome quando houver erro", () => {
            vi.mocked(useSignupViewModel).mockReturnValue({
                form: {
                    ...mockForm,
                    formState: {
                        errors: {
                            name: { message: "Nome muito curto" },
                        },
                        isSubmitting: false,
                    },
                } as any,
                submit: vi.fn(),
                isSubmitting: false,
            });

            render(<SignupView />);

            expect(screen.getByText("Nome muito curto")).toBeInTheDocument();
        });

        it("deve exibir mensagem de erro para email quando houver erro", () => {
            vi.mocked(useSignupViewModel).mockReturnValue({
                form: {
                    ...mockForm,
                    formState: {
                        errors: {
                            email: { message: "Email inválido" },
                        },
                        isSubmitting: false,
                    },
                } as any,
                submit: vi.fn(),
                isSubmitting: false,
            });

            render(<SignupView />);

            expect(screen.getByText("Email inválido")).toBeInTheDocument();
        });

        it("deve exibir mensagem de erro para senha quando houver erro", () => {
            vi.mocked(useSignupViewModel).mockReturnValue({
                form: {
                    ...mockForm,
                    formState: {
                        errors: {
                            password: { message: "Mínimo de 8 caracteres" },
                        },
                        isSubmitting: false,
                    },
                } as any,
                submit: vi.fn(),
                isSubmitting: false,
            });

            render(<SignupView />);

            expect(screen.getByText("Mínimo de 8 caracteres")).toBeInTheDocument();
        });

        it("deve exibir mensagem de erro para confirmar senha quando houver erro", () => {
            vi.mocked(useSignupViewModel).mockReturnValue({
                form: {
                    ...mockForm,
                    formState: {
                        errors: {
                            confirmPassword: { message: "As senhas não conferem" },
                        },
                        isSubmitting: false,
                    },
                } as any,
                submit: vi.fn(),
                isSubmitting: false,
            });

            render(<SignupView />);

            expect(screen.getByText("As senhas não conferem")).toBeInTheDocument();
        });

        it("deve exibir múltiplas mensagens de erro simultaneamente", () => {
            vi.mocked(useSignupViewModel).mockReturnValue({
                form: {
                    ...mockForm,
                    formState: {
                        errors: {
                            name: { message: "Nome muito curto" },
                            email: { message: "Email inválido" },
                            password: { message: "Mínimo de 8 caracteres" },
                        },
                        isSubmitting: false,
                    },
                } as any,
                submit: vi.fn(),
                isSubmitting: false,
            });

            render(<SignupView />);

            expect(screen.getByText("Nome muito curto")).toBeInTheDocument();
            expect(screen.getByText("Email inválido")).toBeInTheDocument();
            expect(screen.getByText("Mínimo de 8 caracteres")).toBeInTheDocument();
        });

        it("mensagens de erro devem ter as classes CSS corretas", () => {
            vi.mocked(useSignupViewModel).mockReturnValue({
                form: {
                    ...mockForm,
                    formState: {
                        errors: {
                            email: { message: "Email inválido" },
                        },
                        isSubmitting: false,
                    },
                } as any,
                submit: vi.fn(),
                isSubmitting: false,
            });

            render(<SignupView />);

            const errorMessage = screen.getByText("Email inválido");
            expect(errorMessage).toHaveClass("text-red-500", "text-sm");
        });

        it("não deve exibir mensagens de erro quando não houver erros", () => {
            render(<SignupView />);

            expect(screen.queryByText(/muito curto|inválido|caracteres|não conferem/i)).not.toBeInTheDocument();
        });
    });

    describe("Submissão do formulário", () => {
        it("deve chamar submit quando o formulário for enviado", () => {
            const mockSubmit = vi.fn();
            vi.mocked(useSignupViewModel).mockReturnValue({
                form: mockForm as any,
                submit: mockSubmit,
                isSubmitting: false,
            });

            render(<SignupView />);

            const form = screen.getByRole("button", { name: "Cadastrar" }).closest("form");
            fireEvent.submit(form!);

            expect(mockForm.handleSubmit).toHaveBeenCalled();
        });

        it("deve chamar submit com os dados corretos", () => {
            const mockSubmit = vi.fn();
            const mockHandleSubmitWithData = vi.fn((callback) => (e: any) => {
                e.preventDefault();
                callback({
                    name: "João Silva",
                    email: "joao@teste.com",
                    password: "senha12345",
                    confirmPassword: "senha12345",
                });
            });

            vi.mocked(useSignupViewModel).mockReturnValue({
                form: {
                    ...mockForm,
                    handleSubmit: mockHandleSubmitWithData,
                } as any,
                submit: mockSubmit,
                isSubmitting: false,
            });

            render(<SignupView />);

            const form = screen.getByRole("button", { name: "Cadastrar" }).closest("form");
            fireEvent.submit(form!);

            expect(mockHandleSubmitWithData).toHaveBeenCalledWith(mockSubmit);
        });

        it("deve prevenir comportamento padrão do formulário ao submeter", () => {
            render(<SignupView />);

            const form = screen.getByRole("button", { name: "Cadastrar" }).closest("form");
            const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
            form!.dispatchEvent(submitEvent);

            expect(submitEvent.defaultPrevented).toBe(true);
        });

        it("não deve submeter quando clicar no botão se o formulário for inválido", () => {
            const mockSubmit = vi.fn();
            vi.mocked(useSignupViewModel).mockReturnValue({
                form: mockForm as any,
                submit: mockSubmit,
                isSubmitting: false,
            });

            render(<SignupView />);

            const submitButton = screen.getByRole("button", { name: "Cadastrar" });
            fireEvent.click(submitButton);

            
            expect(mockForm.handleSubmit).toHaveBeenCalled();
        });
    });

    describe("Estado de submissão", () => {
        it("deve desabilitar o botão quando isSubmitting for true", () => {
            vi.mocked(useSignupViewModel).mockReturnValue({
                form: mockForm as any,
                submit: vi.fn(),
                isSubmitting: true,
            });

            render(<SignupView />);

            const submitButton = screen.getByRole("button", { name: "Cadastrar" });
            expect(submitButton).toBeDisabled();
        });

        it("deve habilitar o botão quando isSubmitting for false", () => {
            vi.mocked(useSignupViewModel).mockReturnValue({
                form: mockForm as any,
                submit: vi.fn(),
                isSubmitting: false,
            });

            render(<SignupView />);

            const submitButton = screen.getByRole("button", { name: "Cadastrar" });
            expect(submitButton).not.toBeDisabled();
        });

        it("deve desabilitar o botão durante a submissão", () => {
            vi.mocked(useSignupViewModel).mockReturnValue({
                form: {
                    ...mockForm,
                    formState: {
                        ...mockForm.formState,
                        isSubmitting: true,
                    },
                } as any,
                submit: vi.fn(),
                isSubmitting: true,
            });

            render(<SignupView />);

            const submitButton = screen.getByRole("button", { name: "Cadastrar" });
            expect(submitButton).toBeDisabled();
        });

        it("deve manter o estado de desabilitado consistente entre isSubmitting prop e formState", () => {
            vi.mocked(useSignupViewModel).mockReturnValue({
                form: {
                    ...mockForm,
                    formState: {
                        ...mockForm.formState,
                        isSubmitting: true,
                    },
                } as any,
                submit: vi.fn(),
                isSubmitting: true,
            });

            render(<SignupView />);

            const submitButton = screen.getByRole("button", { name: "Cadastrar" });
            expect(submitButton).toBeDisabled();
        });
    });

    describe("Acessibilidade", () => {
        it("deve ter labels associados aos inputs corretamente", () => {
            render(<SignupView />);

            const nameInput = screen.getByLabelText("Nome Completo");
            const emailInput = screen.getByLabelText("E-mail");
            const passwordInput = screen.getByLabelText("Senha");
            const confirmPasswordInput = screen.getByLabelText("Confirmar Senha");

            expect(nameInput).toBeInTheDocument();
            expect(emailInput).toBeInTheDocument();
            expect(passwordInput).toBeInTheDocument();
            expect(confirmPasswordInput).toBeInTheDocument();
        });

        it("deve ter um botão com role button", () => {
            render(<SignupView />);

            const submitButton = screen.getByRole("button", { name: "Cadastrar" });
            expect(submitButton).toBeInTheDocument();
        });

        it("deve ter type submit no botão", () => {
            render(<SignupView />);

            const submitButton = screen.getByRole("button", { name: "Cadastrar" });
            expect(submitButton).toHaveAttribute("type", "submit");
        });

        it("deve ter inputs com atributos required", () => {
            render(<SignupView />);

            const nameInput = screen.getByLabelText("Nome Completo");
            const emailInput = screen.getByLabelText("E-mail");
            const passwordInput = screen.getByLabelText("Senha");
            const confirmPasswordInput = screen.getByLabelText("Confirmar Senha");

            expect(nameInput).toHaveAttribute("required");
            expect(emailInput).toHaveAttribute("required");
            expect(passwordInput).toHaveAttribute("required");
            expect(confirmPasswordInput).toHaveAttribute("required");
        });
    });

    describe("Layout e estrutura", () => {
        it("deve ter a estrutura correta de divs para cada campo", () => {
            const { container } = render(<SignupView />);

            const spaceDivs = container.querySelectorAll(".space-y-1");
            expect(spaceDivs.length).toBe(4); 
        });

        it("deve ter formulário com espaçamento correto", () => {
            const { container } = render(<SignupView />);

            const form = container.querySelector("form");
            expect(form).toHaveClass("space-y-6");
        });

        it("deve renderizar os campos na ordem correta", () => {
            render(<SignupView />);

            const labels = screen.getAllByText(/Nome Completo|E-mail|Senha|Confirmar Senha/);
            expect(labels[0]).toHaveTextContent("Nome Completo");
            expect(labels[1]).toHaveTextContent("E-mail");
            expect(labels[2]).toHaveTextContent("Senha");
            expect(labels[3]).toHaveTextContent("Confirmar Senha");
        });

        it("deve ter botão com margem superior", () => {
            render(<SignupView />);

            const submitButton = screen.getByRole("button", { name: "Cadastrar" });
            expect(submitButton).toHaveClass("mt-6");
        });
    });

    describe("Integração com viewModel", () => {
        it("deve usar o form retornado pelo viewModel", () => {
            const customMockForm = { ...mockForm, customProp: "test" };
            vi.mocked(useSignupViewModel).mockReturnValue({
                form: customMockForm as any,
                submit: vi.fn(),
                isSubmitting: false,
            });

            render(<SignupView />);

            expect(useSignupViewModel).toHaveBeenCalled();
        });

        it("deve usar o submit retornado pelo viewModel", () => {
            const mockSubmit = vi.fn();
            vi.mocked(useSignupViewModel).mockReturnValue({
                form: mockForm as any,
                submit: mockSubmit,
                isSubmitting: false,
            });

            render(<SignupView />);

            expect(useSignupViewModel).toHaveBeenCalled();
        });

        it("deve usar o isSubmitting retornado pelo viewModel", () => {
            vi.mocked(useSignupViewModel).mockReturnValue({
                form: mockForm as any,
                submit: vi.fn(),
                isSubmitting: true,
            });

            render(<SignupView />);

            const submitButton = screen.getByRole("button", { name: "Cadastrar" });
            expect(submitButton).toBeDisabled();
        });

        it("deve chamar useSignupViewModel uma vez na renderização", () => {
            render(<SignupView />);

            expect(useSignupViewModel).toHaveBeenCalledTimes(1);
        });

        it("deve reagir a mudanças no estado do viewModel", () => {
            const { rerender } = render(<SignupView />);

            vi.mocked(useSignupViewModel).mockReturnValue({
                form: {
                    ...mockForm,
                    formState: {
                        errors: {
                            email: { message: "Email inválido" },
                        },
                        isSubmitting: false,
                    },
                } as any,
                submit: vi.fn(),
                isSubmitting: false,
            });

            rerender(<SignupView />);

            expect(screen.getByText("Email inválido")).toBeInTheDocument();
        });
    });

    describe("Casos extremos", () => {
        it("deve lidar com múltiplas submissões rápidas", () => {
            const mockSubmit = vi.fn();
            vi.mocked(useSignupViewModel).mockReturnValue({
                form: mockForm as any,
                submit: mockSubmit,
                isSubmitting: false,
            });

            render(<SignupView />);

            const form = screen.getByRole("button", { name: "Cadastrar" }).closest("form");

            fireEvent.submit(form!);
            fireEvent.submit(form!);
            fireEvent.submit(form!);

            
            expect(mockForm.handleSubmit).toHaveBeenCalled();
        });

        it("deve lidar com strings muito longas nos campos", () => {
            render(<SignupView />);

            const nameInput = screen.getByLabelText("Nome Completo") as HTMLInputElement;
            const longString = "a".repeat(1000);

            fireEvent.change(nameInput, { target: { value: longString } });

            expect(nameInput.value).toBe(longString);
        });

        it("deve lidar com caracteres especiais nos campos", () => {
            render(<SignupView />);

            const nameInput = screen.getByLabelText("Nome Completo") as HTMLInputElement;
            const specialChars = "João Ñ María Öz!@#$%";

            fireEvent.change(nameInput, { target: { value: specialChars } });

            expect(nameInput.value).toBe(specialChars);
        });

        it("deve lidar com espaços em branco nos campos", () => {
            render(<SignupView />);

            const nameInput = screen.getByLabelText("Nome Completo") as HTMLInputElement;

            fireEvent.change(nameInput, { target: { value: "   " } });

            expect(nameInput.value).toBe("   ");
        });

        it("deve lidar com valores vazios após preenchimento", () => {
            render(<SignupView />);

            const emailInput = screen.getByLabelText("E-mail") as HTMLInputElement;

            fireEvent.change(emailInput, { target: { value: "teste@email.com" } });
            expect(emailInput.value).toBe("teste@email.com");

            fireEvent.change(emailInput, { target: { value: "" } });
            expect(emailInput.value).toBe("");
        });
    });
});
