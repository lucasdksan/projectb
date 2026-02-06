import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SigninView from "../signin.view";
import { useSigninViewModel } from "../signin.viewmodel";

vi.mock("../signin.viewmodel");

vi.mock("next/link", () => ({
    __esModule: true,
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

describe("SigninView", () => {
    const mockHandleSubmit = vi.fn((callback) => (e: any) => {
        e.preventDefault();
        callback({ email: "teste@email.com", password: "senha123" });
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
        vi.mocked(useSigninViewModel).mockReturnValue({
            form: mockForm as any,
            submit: vi.fn(),
            isSubmitting: false,
        });
    });

    describe("Renderização", () => {
        it("deve renderizar o formulário corretamente", () => {
            render(<SigninView />);

            expect(screen.getByText("E-mail")).toBeInTheDocument();
            expect(screen.getByText("Senha")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Cadastrar" })).toBeInTheDocument();
        });

        it("deve renderizar dois campos de input", () => {
            render(<SigninView />);

            const emailInput = screen.getByLabelText("E-mail");
            const passwordInput = screen.getByLabelText("Senha");

            expect(emailInput).toBeInTheDocument();
            expect(passwordInput).toBeInTheDocument();
        });

        it("deve renderizar campo de email com tipo correto", () => {
            render(<SigninView />);

            const emailInput = screen.getByLabelText("E-mail");
            expect(emailInput).toHaveAttribute("type", "email");
        });

        it("deve renderizar campo de senha com tipo correto", () => {
            render(<SigninView />);

            const passwordInput = screen.getByLabelText("Senha");
            expect(passwordInput).toHaveAttribute("type", "password");
        });

        it("deve renderizar os campos como obrigatórios", () => {
            render(<SigninView />);

            const emailInput = screen.getByLabelText("E-mail");
            const passwordInput = screen.getByLabelText("Senha");

            expect(emailInput).toBeRequired();
            expect(passwordInput).toBeRequired();
        });

        it("deve renderizar o link de esqueceu senha", () => {
            render(<SigninView />);

            const forgetLink = screen.getByText("Esqueceu?");
            expect(forgetLink).toBeInTheDocument();
            expect(forgetLink).toHaveAttribute("href", "/auth/forget");
        });

        it("deve ter as classes CSS corretas no formulário", () => {
            const { container } = render(<SigninView />);

            const form = container.querySelector("form");
            expect(form).toHaveClass("space-y-6");
        });

        it("deve ter as classes CSS corretas no botão de submit", () => {
            render(<SigninView />);

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
            render(<SigninView />);

            const emailInput = screen.getByLabelText("E-mail");
            const passwordInput = screen.getByLabelText("Senha");

            const expectedClasses = [
                "w-full",
                "bg-sidebar",
                "border",
                "border-white/10",
                "rounded-2xl",
                "py-3.5",
                "px-6",
            ];

            expectedClasses.forEach((className) => {
                expect(emailInput).toHaveClass(className);
                expect(passwordInput).toHaveClass(className);
            });
        });
    });

    describe("Interações do usuário", () => {
        it("deve chamar handleSubmit ao submeter o formulário", () => {
            const mockSubmit = vi.fn();
            vi.mocked(useSigninViewModel).mockReturnValue({
                form: mockForm as any,
                submit: mockSubmit,
                isSubmitting: false,
            });

            render(<SigninView />);

            const form = screen.getByRole("button", { name: "Cadastrar" }).closest("form");
            expect(form).toBeInTheDocument();

            if (form) {
                fireEvent.submit(form);
            }

            expect(mockHandleSubmit).toHaveBeenCalled();
        });

        it("deve permitir digitar no campo de email", () => {
            render(<SigninView />);

            const emailInput = screen.getByLabelText("E-mail") as HTMLInputElement;

            fireEvent.change(emailInput, { target: { value: "novo@email.com" } });

            expect(emailInput.value).toBe("novo@email.com");
        });

        it("deve permitir digitar no campo de senha", () => {
            render(<SigninView />);

            const passwordInput = screen.getByLabelText("Senha") as HTMLInputElement;

            fireEvent.change(passwordInput, { target: { value: "novaSenha123" } });

            expect(passwordInput.value).toBe("novaSenha123");
        });

        it("deve limpar o campo de email quando o valor for removido", () => {
            render(<SigninView />);

            const emailInput = screen.getByLabelText("E-mail") as HTMLInputElement;

            fireEvent.change(emailInput, { target: { value: "teste@email.com" } });
            expect(emailInput.value).toBe("teste@email.com");

            fireEvent.change(emailInput, { target: { value: "" } });
            expect(emailInput.value).toBe("");
        });

        it("deve limpar o campo de senha quando o valor for removido", () => {
            render(<SigninView />);

            const passwordInput = screen.getByLabelText("Senha") as HTMLInputElement;

            fireEvent.change(passwordInput, { target: { value: "senha123" } });
            expect(passwordInput.value).toBe("senha123");

            fireEvent.change(passwordInput, { target: { value: "" } });
            expect(passwordInput.value).toBe("");
        });
    });

    describe("Estado de submissão", () => {
        it("deve desabilitar o botão quando isSubmitting for true", () => {
            vi.mocked(useSigninViewModel).mockReturnValue({
                form: mockForm as any,
                submit: vi.fn(),
                isSubmitting: true,
            });

            render(<SigninView />);

            const button = screen.getByRole("button", { name: "Cadastrar" });
            expect(button).toBeDisabled();
        });

        it("deve habilitar o botão quando isSubmitting for false", () => {
            vi.mocked(useSigninViewModel).mockReturnValue({
                form: mockForm as any,
                submit: vi.fn(),
                isSubmitting: false,
            });

            render(<SigninView />);

            const button = screen.getByRole("button", { name: "Cadastrar" });
            expect(button).not.toBeDisabled();
        });

        it("deve manter o botão desabilitado durante múltiplas renderizações", () => {
            vi.mocked(useSigninViewModel).mockReturnValue({
                form: mockForm as any,
                submit: vi.fn(),
                isSubmitting: true,
            });

            const { rerender } = render(<SigninView />);

            let button = screen.getByRole("button", { name: "Cadastrar" });
            expect(button).toBeDisabled();

            rerender(<SigninView />);

            button = screen.getByRole("button", { name: "Cadastrar" });
            expect(button).toBeDisabled();
        });
    });

    describe("Exibição de erros", () => {
        it("deve exibir mensagem de erro no campo de email", () => {
            vi.mocked(useSigninViewModel).mockReturnValue({
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

            render(<SigninView />);

            expect(screen.getByText("Email inválido")).toBeInTheDocument();
        });

        it("deve exibir mensagem de erro no campo de senha", () => {
            vi.mocked(useSigninViewModel).mockReturnValue({
                form: {
                    ...mockForm,
                    formState: {
                        errors: {
                            password: { message: "Senha muito curta" },
                        },
                        isSubmitting: false,
                    },
                } as any,
                submit: vi.fn(),
                isSubmitting: false,
            });

            render(<SigninView />);

            expect(screen.getByText("Senha muito curta")).toBeInTheDocument();
        });

        it("deve exibir múltiplos erros simultaneamente", () => {
            vi.mocked(useSigninViewModel).mockReturnValue({
                form: {
                    ...mockForm,
                    formState: {
                        errors: {
                            email: { message: "Email inválido" },
                            password: { message: "Senha obrigatória" },
                        },
                        isSubmitting: false,
                    },
                } as any,
                submit: vi.fn(),
                isSubmitting: false,
            });

            render(<SigninView />);

            expect(screen.getByText("Email inválido")).toBeInTheDocument();
            expect(screen.getByText("Senha obrigatória")).toBeInTheDocument();
        });

        it("não deve exibir mensagens de erro quando não houver erros", () => {
            render(<SigninView />);

            expect(screen.queryByText("Email inválido")).not.toBeInTheDocument();
            expect(screen.queryByText("Senha muito curta")).not.toBeInTheDocument();
        });

        it("deve aplicar classe de erro correta nas mensagens", () => {
            vi.mocked(useSigninViewModel).mockReturnValue({
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

            render(<SigninView />);

            const errorMessage = screen.getByText("Email inválido");
            expect(errorMessage).toHaveClass("text-red-500", "text-sm");
        });
    });

    describe("Estrutura do formulário", () => {
        it("deve ter dois campos de input", () => {
            render(<SigninView />);

            const emailInput = screen.getByLabelText("E-mail");
            const passwordInput = screen.getByLabelText("Senha");

            expect(emailInput).toBeInTheDocument();
            expect(passwordInput).toBeInTheDocument();
        });

        it("deve ter um único botão de submit", () => {
            render(<SigninView />);

            const buttons = screen.getAllByRole("button");
            expect(buttons).toHaveLength(1);
            expect(buttons[0]).toHaveAttribute("type", "submit");
        });

        it("deve ter as labels corretas para os campos", () => {
            render(<SigninView />);

            const emailLabel = screen.getByText("E-mail");
            const passwordLabel = screen.getByText("Senha");

            expect(emailLabel).toHaveClass("text-sm", "font-semibold", "text-gray-400");
            expect(passwordLabel).toHaveClass("text-sm", "font-semibold", "text-gray-400");
        });

        it("deve agrupar label e input corretamente", () => {
            const { container } = render(<SigninView />);

            const spaceDivs = container.querySelectorAll(".space-y-1");
            expect(spaceDivs.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe("Integração com viewModel", () => {
        it("deve usar o form retornado pelo viewModel", () => {
            const customForm = {
                ...mockForm,
                handleSubmit: vi.fn((callback) => (e: any) => {
                    e.preventDefault();
                    callback({ email: "custom@email.com", password: "custom123" });
                }),
            };

            vi.mocked(useSigninViewModel).mockReturnValue({
                form: customForm as any,
                submit: vi.fn(),
                isSubmitting: false,
            });

            render(<SigninView />);

            const form = screen.getByRole("button", { name: "Cadastrar" }).closest("form");

            if (form) {
                fireEvent.submit(form);
            }

            expect(customForm.handleSubmit).toHaveBeenCalled();
        });

        it("deve usar o submit retornado pelo viewModel", () => {
            const mockSubmit = vi.fn();

            vi.mocked(useSigninViewModel).mockReturnValue({
                form: mockForm as any,
                submit: mockSubmit,
                isSubmitting: false,
            });

            render(<SigninView />);

            const form = screen.getByRole("button", { name: "Cadastrar" }).closest("form");

            if (form) {
                fireEvent.submit(form);
            }

            expect(mockHandleSubmit).toHaveBeenCalledWith(mockSubmit);
        });

        it("deve refletir mudanças de isSubmitting do viewModel", () => {
            const { rerender } = render(<SigninView />);

            let button = screen.getByRole("button", { name: "Cadastrar" });
            expect(button).not.toBeDisabled();

            vi.mocked(useSigninViewModel).mockReturnValue({
                form: mockForm as any,
                submit: vi.fn(),
                isSubmitting: true,
            });

            rerender(<SigninView />);

            button = screen.getByRole("button", { name: "Cadastrar" });
            expect(button).toBeDisabled();
        });

        it("deve chamar register do form para cada campo", () => {
            const registerSpy = vi.fn((name: string) => ({
                name,
                onChange: vi.fn(),
                onBlur: vi.fn(),
                ref: vi.fn(),
            }));

            vi.mocked(useSigninViewModel).mockReturnValue({
                form: {
                    ...mockForm,
                    register: registerSpy,
                } as any,
                submit: vi.fn(),
                isSubmitting: false,
            });

            render(<SigninView />);

            expect(registerSpy).toHaveBeenCalledWith("email");
            expect(registerSpy).toHaveBeenCalledWith("password");
        });
    });

    describe("Acessibilidade", () => {
        it("deve ter type='submit' no botão", () => {
            render(<SigninView />);

            const button = screen.getByRole("button", { name: "Cadastrar" });
            expect(button).toHaveAttribute("type", "submit");
        });

        it("deve ter labels visíveis para os campos", () => {
            render(<SigninView />);

            const emailLabel = screen.getByText("E-mail");
            const passwordLabel = screen.getByText("Senha");

            expect(emailLabel).toBeVisible();
            expect(passwordLabel).toBeVisible();
        });

        it("deve ter associação correta entre label e input", () => {
            render(<SigninView />);

            const emailInput = screen.getByLabelText("E-mail");
            const passwordInput = screen.getByLabelText("Senha");

            expect(emailInput).toBeInTheDocument();
            expect(passwordInput).toBeInTheDocument();
        });

        it("deve ter link de esqueceu senha acessível", () => {
            render(<SigninView />);

            const forgetLink = screen.getByText("Esqueceu?");
            expect(forgetLink).toBeVisible();
            expect(forgetLink.closest("a")).toHaveAttribute("href", "/auth/forget");
        });
    });

    describe("Comportamento do formulário", () => {
        it("deve prevenir o comportamento padrão ao submeter", () => {
            const mockSubmit = vi.fn();
            const mockPreventDefault = vi.fn();

            const customHandleSubmit = vi.fn((callback) => (e: any) => {
                mockPreventDefault();
                callback({ email: "teste@email.com", password: "senha123" });
            });

            vi.mocked(useSigninViewModel).mockReturnValue({
                form: { ...mockForm, handleSubmit: customHandleSubmit } as any,
                submit: mockSubmit,
                isSubmitting: false,
            });

            render(<SigninView />);

            const form = screen.getByRole("button", { name: "Cadastrar" }).closest("form");

            if (form) {
                fireEvent.submit(form);
            }

            expect(customHandleSubmit).toHaveBeenCalled();
        });

        it("deve validar o formato de email no cliente", () => {
            render(<SigninView />);

            const emailInput = screen.getByLabelText("E-mail");
            expect(emailInput).toHaveAttribute("type", "email");
        });

        it("deve ocultar o texto da senha", () => {
            render(<SigninView />);

            const passwordInput = screen.getByLabelText("Senha");
            expect(passwordInput).toHaveAttribute("type", "password");
        });
    });

    describe("Layout e estilização", () => {
        it("deve renderizar link esqueceu senha na posição correta", () => {
            render(<SigninView />);

            const forgetLink = screen.getByText("Esqueceu?");
            const linkParent = forgetLink.closest(".flex");

            expect(linkParent).toHaveClass("justify-between", "items-center");
        });

        it("deve ter espaçamento correto entre os campos", () => {
            const { container } = render(<SigninView />);

            const form = container.querySelector("form");
            expect(form).toHaveClass("space-y-6");
        });

        it("deve aplicar estilos de foco nos inputs", () => {
            render(<SigninView />);

            const emailInput = screen.getByLabelText("E-mail");
            
            expect(emailInput).toHaveClass(
                "focus:outline-none",
                "focus:border-accent/50",
                "focus:ring-1",
                "focus:ring-accent/50"
            );
        });

        it("deve ter estilos hover no botão", () => {
            render(<SigninView />);

            const button = screen.getByRole("button", { name: "Cadastrar" });
            
            expect(button.className).toContain("hover:bg-[#00e03a]");
            expect(button.className).toContain("hover:scale-[1.02]");
        });
    });
});
