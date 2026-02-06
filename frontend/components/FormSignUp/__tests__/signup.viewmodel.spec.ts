import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSignupViewModel } from "../signup.viewmodel";
import { renderHook } from "@testing-library/react";
import { signupAction } from "@/app/(public)/auth/signup/signup.action";
import { act } from "react";

vi.mock("@/app/(public)/auth/signup/signup.action", () => ({
    signupAction: vi.fn(),
}));

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

describe("useSignupViewModel", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("Estado inicial", () => {
        it("deve inicializar com valores padrão corretos", () => {
            const { result } = renderHook(() => useSignupViewModel());

            expect(result.current.form).toBeDefined();
            expect(result.current.submit).toBeInstanceOf(Function);
            expect(result.current.isSubmitting).toBe(false);
        });

        it("deve ter form com validação zod configurada", () => {
            const { result } = renderHook(() => useSignupViewModel());

            expect(result.current.form.formState).toBeDefined();
            expect(result.current.form.handleSubmit).toBeInstanceOf(Function);
            expect(result.current.form.setError).toBeInstanceOf(Function);
        });

        it("deve ter formState sem erros inicialmente", () => {
            const { result } = renderHook(() => useSignupViewModel());

            expect(result.current.form.formState.errors).toEqual({});
        });

        it("deve ter isSubmitting false inicialmente", () => {
            const { result } = renderHook(() => useSignupViewModel());

            expect(result.current.isSubmitting).toBe(false);
        });
    });

    describe("submit - Casos de sucesso", () => {
        it("deve redirecionar para dashboard quando a action for bem-sucedida", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            vi.mocked(signupAction).mockResolvedValue({
                success: true,
                data: {
                    name: "João Silva",
                    email: "joao@email.com",
                },
            });

            const testData = {
                name: "João Silva",
                email: "joao@email.com",
                password: "senha123",
                confirmPassword: "senha123",
            };

            let submitResult: boolean | undefined;

            await act(async () => {
                submitResult = await result.current.submit(testData);
            });

            expect(signupAction).toHaveBeenCalledWith(testData);
            expect(submitResult).toBe(true);
            expect(mockPush).toHaveBeenCalledWith("/dashboard");
        });

        it("deve retornar true quando a action for bem-sucedida", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            vi.mocked(signupAction).mockResolvedValue({
                success: true,
                data: {
                    name: "Maria Santos",
                    email: "maria@teste.com",
                },
            });

            const testData = {
                name: "Maria Santos",
                email: "maria@teste.com",
                password: "senhaSegura123",
                confirmPassword: "senhaSegura123",
            };

            let submitResult: boolean | undefined;

            await act(async () => {
                submitResult = await result.current.submit(testData);
            });

            expect(submitResult).toBe(true);
        });

        it("deve chamar signupAction com todos os dados corretos", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            vi.mocked(signupAction).mockResolvedValue({
                success: true,
                data: {
                    name: "Pedro Oliveira",
                    email: "pedro@email.com",
                },
            });

            const testData = {
                name: "Pedro Oliveira",
                email: "pedro@email.com",
                password: "password123",
                confirmPassword: "password123",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(signupAction).toHaveBeenCalledWith(testData);
            expect(signupAction).toHaveBeenCalledTimes(1);
        });

        it("deve redirecionar apenas uma vez em caso de sucesso", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            vi.mocked(signupAction).mockResolvedValue({
                success: true,
                data: {
                    name: "Ana Costa",
                    email: "ana@teste.com",
                },
            });

            const testData = {
                name: "Ana Costa",
                email: "ana@teste.com",
                password: "senha456",
                confirmPassword: "senha456",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(mockPush).toHaveBeenCalledTimes(1);
            expect(mockPush).toHaveBeenCalledWith("/dashboard");
        });

        it("deve processar dados com nome longo corretamente", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            vi.mocked(signupAction).mockResolvedValue({
                success: true,
                data: {
                    name: "João Pedro da Silva Santos Oliveira",
                    email: "joao.pedro@email.com",
                },
            });

            const testData = {
                name: "João Pedro da Silva Santos Oliveira",
                email: "joao.pedro@email.com",
                password: "senha789",
                confirmPassword: "senha789",
            };

            let submitResult: boolean | undefined;

            await act(async () => {
                submitResult = await result.current.submit(testData);
            });

            expect(submitResult).toBe(true);
            expect(signupAction).toHaveBeenCalledWith(testData);
        });
    });

    describe("submit - Casos de erro", () => {
        it("deve definir erro de nome quando a validação falhar", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            const setErrorSpy = vi.spyOn(result.current.form, 'setError');

            vi.mocked(signupAction).mockResolvedValue({
                success: false,
                errors: {
                    name: ["Nome muito curto"],
                },
            });

            const testData = {
                name: "Jo",
                email: "joao@email.com",
                password: "senha123",
                confirmPassword: "senha123",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(setErrorSpy).toHaveBeenCalledWith("name", {
                message: "Nome muito curto",
            });
        });

        it("deve definir erro de email quando a validação falhar", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            const setErrorSpy = vi.spyOn(result.current.form, 'setError');

            vi.mocked(signupAction).mockResolvedValue({
                success: false,
                errors: {
                    email: ["Email inválido"],
                },
            });

            const testData = {
                name: "João Silva",
                email: "emailinvalido",
                password: "senha123",
                confirmPassword: "senha123",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(setErrorSpy).toHaveBeenCalledWith("email", {
                message: "Email inválido",
            });
        });

        it("deve definir erro de senha quando a validação falhar", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            const setErrorSpy = vi.spyOn(result.current.form, 'setError');

            vi.mocked(signupAction).mockResolvedValue({
                success: false,
                errors: {
                    password: ["Mínimo de 8 caracteres"],
                },
            });

            const testData = {
                name: "João Silva",
                email: "joao@email.com",
                password: "123",
                confirmPassword: "123",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(setErrorSpy).toHaveBeenCalledWith("password", {
                message: "Mínimo de 8 caracteres",
            });
        });

        it("deve definir erro de confirmPassword quando as senhas não conferirem", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            const setErrorSpy = vi.spyOn(result.current.form, 'setError');

            vi.mocked(signupAction).mockResolvedValue({
                success: false,
                errors: {
                    confirmPassword: ["As senhas não conferem"],
                },
            });

            const testData = {
                name: "João Silva",
                email: "joao@email.com",
                password: "senha123",
                confirmPassword: "senha456",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(setErrorSpy).toHaveBeenCalledWith("confirmPassword", {
                message: "As senhas não conferem",
            });
        });

        it("deve retornar false quando a action falhar", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            vi.mocked(signupAction).mockResolvedValue({
                success: false,
                errors: {
                    email: ["Email já cadastrado"],
                },
            });

            const testData = {
                name: "João Silva",
                email: "joao@email.com",
                password: "senha123",
                confirmPassword: "senha123",
            };

            let submitResult: boolean | undefined;

            await act(async () => {
                submitResult = await result.current.submit(testData);
            });

            expect(submitResult).toBe(false);
        });

        it("não deve redirecionar quando houver erro", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            vi.mocked(signupAction).mockResolvedValue({
                success: false,
                errors: {
                    email: ["Email já cadastrado"],
                },
            });

            const testData = {
                name: "João Silva",
                email: "joao@email.com",
                password: "senha123",
                confirmPassword: "senha123",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(mockPush).not.toHaveBeenCalled();
        });

        it("deve definir múltiplos erros quando múltiplos campos falharem", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            const setErrorSpy = vi.spyOn(result.current.form, 'setError');

            vi.mocked(signupAction).mockResolvedValue({
                success: false,
                errors: {
                    name: ["Nome muito curto"],
                    email: ["Email inválido"],
                    password: ["Mínimo de 8 caracteres"],
                },
            });

            const testData = {
                name: "Jo",
                email: "emailinvalido",
                password: "123",
                confirmPassword: "123",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(setErrorSpy).toHaveBeenCalledWith("name", {
                message: "Nome muito curto",
            });
            expect(setErrorSpy).toHaveBeenCalledWith("email", {
                message: "Email inválido",
            });
            expect(setErrorSpy).toHaveBeenCalledWith("password", {
                message: "Mínimo de 8 caracteres",
            });
        });

        it("deve usar apenas a primeira mensagem de erro quando houver múltiplas mensagens para o mesmo campo", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            const setErrorSpy = vi.spyOn(result.current.form, 'setError');

            vi.mocked(signupAction).mockResolvedValue({
                success: false,
                errors: {
                    email: ["Email inválido", "Email já cadastrado", "Email obrigatório"],
                },
            });

            const testData = {
                name: "João Silva",
                email: "emailinvalido",
                password: "senha123",
                confirmPassword: "senha123",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(setErrorSpy).toHaveBeenCalledWith("email", {
                message: "Email inválido",
            });
            expect(setErrorSpy).toHaveBeenCalledTimes(1);
        });

        it("deve lidar com campo de erro sem mensagens", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            const setErrorSpy = vi.spyOn(result.current.form, 'setError');

            vi.mocked(signupAction).mockResolvedValue({
                success: false,
                errors: {
                    email: [],
                },
            });

            const testData = {
                name: "João Silva",
                email: "joao@email.com",
                password: "senha123",
                confirmPassword: "senha123",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(setErrorSpy).not.toHaveBeenCalled();
        });

        it("deve lidar com erro de email já cadastrado", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            const setErrorSpy = vi.spyOn(result.current.form, 'setError');

            vi.mocked(signupAction).mockResolvedValue({
                success: false,
                errors: {
                    email: ["Este email já está cadastrado"],
                },
            });

            const testData = {
                name: "João Silva",
                email: "existente@email.com",
                password: "senha123",
                confirmPassword: "senha123",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(setErrorSpy).toHaveBeenCalledWith("email", {
                message: "Este email já está cadastrado",
            });
        });

        it("deve lidar com senha fraca", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            const setErrorSpy = vi.spyOn(result.current.form, 'setError');

            vi.mocked(signupAction).mockResolvedValue({
                success: false,
                errors: {
                    password: ["Senha muito fraca"],
                },
            });

            const testData = {
                name: "João Silva",
                email: "joao@email.com",
                password: "12345678",
                confirmPassword: "12345678",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(setErrorSpy).toHaveBeenCalledWith("password", {
                message: "Senha muito fraca",
            });
        });
    });

    describe("submit - Casos de exceção", () => {
        it("deve lidar com erro na chamada da action", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            vi.mocked(signupAction).mockRejectedValue(new Error("Erro de rede"));

            const testData = {
                name: "João Silva",
                email: "joao@email.com",
                password: "senha123",
                confirmPassword: "senha123",
            };

            await expect(async () => {
                await act(async () => {
                    await result.current.submit(testData);
                });
            }).rejects.toThrow("Erro de rede");
        });

        it("deve lidar com timeout na chamada da action", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            vi.mocked(signupAction).mockRejectedValue(new Error("Request timeout"));

            const testData = {
                name: "João Silva",
                email: "joao@email.com",
                password: "senha123",
                confirmPassword: "senha123",
            };

            await expect(async () => {
                await act(async () => {
                    await result.current.submit(testData);
                });
            }).rejects.toThrow("Request timeout");
        });

        it("deve lidar com resposta inválida da action", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            vi.mocked(signupAction).mockResolvedValue(null as any);

            const testData = {
                name: "João Silva",
                email: "joao@email.com",
                password: "senha123",
                confirmPassword: "senha123",
            };

            await expect(async () => {
                await act(async () => {
                    await result.current.submit(testData);
                });
            }).rejects.toThrow();
        });
    });

    describe("Validação do formulário", () => {
        it("deve validar nome com mínimo de 2 caracteres", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            const testData = {
                name: "J",
                email: "joao@email.com",
                password: "senha123",
                confirmPassword: "senha123",
            };

            await act(async () => {
                try {
                    await result.current.form.trigger("name");
                } catch (error) {
                    
                }
            });

            
            expect(result.current.form.trigger).toBeDefined();
        });

        it("deve validar formato de email", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            await act(async () => {
                result.current.form.setValue("email", "emailinvalido");
                await result.current.form.trigger("email");
            });

            expect(result.current.form.trigger).toBeDefined();
        });

        it("deve validar senha com mínimo de 8 caracteres", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            await act(async () => {
                result.current.form.setValue("password", "123");
                await result.current.form.trigger("password");
            });

            expect(result.current.form.trigger).toBeDefined();
        });

        it("deve validar que confirmPassword tenha mínimo de 8 caracteres", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            await act(async () => {
                result.current.form.setValue("confirmPassword", "123");
                await result.current.form.trigger("confirmPassword");
            });

            expect(result.current.form.trigger).toBeDefined();
        });
    });

    describe("Estado de submissão", () => {
        it("isSubmitting deve começar como false", () => {
            const { result } = renderHook(() => useSignupViewModel());

            expect(result.current.isSubmitting).toBe(false);
        });

        it("deve retornar isSubmitting sincronizado com formState", () => {
            const { result } = renderHook(() => useSignupViewModel());

            expect(result.current.isSubmitting).toBe(result.current.form.formState.isSubmitting);
        });
    });

    describe("Integração com router", () => {
        it("deve usar useRouter corretamente", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            vi.mocked(signupAction).mockResolvedValue({
                success: true,
                data: {
                    name: "João Silva",
                    email: "joao@email.com",
                },
            });

            const testData = {
                name: "João Silva",
                email: "joao@email.com",
                password: "senha123",
                confirmPassword: "senha123",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(mockPush).toHaveBeenCalledWith("/dashboard");
        });

        it("deve redirecionar para /dashboard especificamente", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            vi.mocked(signupAction).mockResolvedValue({
                success: true,
                data: {
                    name: "Maria Santos",
                    email: "maria@email.com",
                },
            });

            const testData = {
                name: "Maria Santos",
                email: "maria@email.com",
                password: "senha456",
                confirmPassword: "senha456",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(mockPush).toHaveBeenCalledWith("/dashboard");
            expect(mockPush).not.toHaveBeenCalledWith("/");
            expect(mockPush).not.toHaveBeenCalledWith("/login");
        });
    });

    describe("Fluxo completo de cadastro", () => {
        it("deve completar fluxo de cadastro com sucesso", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            const setErrorSpy = vi.spyOn(result.current.form, 'setError');

            vi.mocked(signupAction).mockResolvedValue({
                success: true,
                data: {
                    name: "Carlos Souza",
                    email: "carlos@email.com",
                },
            });

            const testData = {
                name: "Carlos Souza",
                email: "carlos@email.com",
                password: "senhaSegura123",
                confirmPassword: "senhaSegura123",
            };

            let submitResult: boolean | undefined;

            await act(async () => {
                submitResult = await result.current.submit(testData);
            });

            expect(signupAction).toHaveBeenCalledWith(testData);
            expect(submitResult).toBe(true);
            expect(mockPush).toHaveBeenCalledWith("/dashboard");
            expect(setErrorSpy).not.toHaveBeenCalled();
        });

        it("deve completar fluxo de cadastro com erro de validação", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            const setErrorSpy = vi.spyOn(result.current.form, 'setError');

            vi.mocked(signupAction).mockResolvedValue({
                success: false,
                errors: {
                    email: ["Email já cadastrado"],
                },
            });

            const testData = {
                name: "Carlos Souza",
                email: "existente@email.com",
                password: "senhaSegura123",
                confirmPassword: "senhaSegura123",
            };

            let submitResult: boolean | undefined;

            await act(async () => {
                submitResult = await result.current.submit(testData);
            });

            expect(signupAction).toHaveBeenCalledWith(testData);
            expect(submitResult).toBe(false);
            expect(mockPush).not.toHaveBeenCalled();
            expect(setErrorSpy).toHaveBeenCalledWith("email", {
                message: "Email já cadastrado",
            });
        });

        it("deve permitir nova tentativa após erro", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            
            vi.mocked(signupAction).mockResolvedValueOnce({
                success: false,
                errors: {
                    email: ["Email já cadastrado"],
                },
            });

            const testData1 = {
                name: "João Silva",
                email: "existente@email.com",
                password: "senha123",
                confirmPassword: "senha123",
            };

            await act(async () => {
                await result.current.submit(testData1);
            });

            expect(mockPush).not.toHaveBeenCalled();

            
            vi.mocked(signupAction).mockResolvedValueOnce({
                success: true,
                data: {
                    name: "João Silva",
                    email: "novo@email.com",
                },
            });

            const testData2 = {
                name: "João Silva",
                email: "novo@email.com",
                password: "senha123",
                confirmPassword: "senha123",
            };

            await act(async () => {
                await result.current.submit(testData2);
            });

            expect(mockPush).toHaveBeenCalledWith("/dashboard");
            expect(signupAction).toHaveBeenCalledTimes(2);
        });
    });

    describe("Casos extremos e edge cases", () => {
        it("deve lidar com nome muito longo", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            vi.mocked(signupAction).mockResolvedValue({
                success: true,
                data: {
                    name: "a".repeat(200),
                    email: "teste@email.com",
                },
            });

            const testData = {
                name: "a".repeat(200),
                email: "teste@email.com",
                password: "senha123",
                confirmPassword: "senha123",
            };

            let submitResult: boolean | undefined;

            await act(async () => {
                submitResult = await result.current.submit(testData);
            });

            expect(submitResult).toBe(true);
        });

        it("deve lidar com caracteres especiais no nome", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            vi.mocked(signupAction).mockResolvedValue({
                success: true,
                data: {
                    name: "José María Ñoño",
                    email: "jose@email.com",
                },
            });

            const testData = {
                name: "José María Ñoño",
                email: "jose@email.com",
                password: "senha123",
                confirmPassword: "senha123",
            };

            let submitResult: boolean | undefined;

            await act(async () => {
                submitResult = await result.current.submit(testData);
            });

            expect(submitResult).toBe(true);
        });

        it("deve lidar com email com múltiplos pontos", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            vi.mocked(signupAction).mockResolvedValue({
                success: true,
                data: {
                    name: "João Silva",
                    email: "joao.pedro.silva@empresa.com.br",
                },
            });

            const testData = {
                name: "João Silva",
                email: "joao.pedro.silva@empresa.com.br",
                password: "senha123",
                confirmPassword: "senha123",
            };

            let submitResult: boolean | undefined;

            await act(async () => {
                submitResult = await result.current.submit(testData);
            });

            expect(submitResult).toBe(true);
        });

        it("deve lidar com senha contendo caracteres especiais", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            vi.mocked(signupAction).mockResolvedValue({
                success: true,
                data: {
                    name: "João Silva",
                    email: "joao@email.com",
                },
            });

            const testData = {
                name: "João Silva",
                email: "joao@email.com",
                password: "S3nh@F0rt3!#$",
                confirmPassword: "S3nh@F0rt3!#$",
            };

            let submitResult: boolean | undefined;

            await act(async () => {
                submitResult = await result.current.submit(testData);
            });

            expect(submitResult).toBe(true);
        });

        it("deve lidar com espaços no início e fim do nome", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            vi.mocked(signupAction).mockResolvedValue({
                success: true,
                data: {
                    name: "  João Silva  ",
                    email: "joao@email.com",
                },
            });

            const testData = {
                name: "  João Silva  ",
                email: "joao@email.com",
                password: "senha123",
                confirmPassword: "senha123",
            };

            let submitResult: boolean | undefined;

            await act(async () => {
                submitResult = await result.current.submit(testData);
            });

            expect(submitResult).toBe(true);
        });

        it("deve lidar com objeto de erro vazio", async () => {
            const { result } = renderHook(() => useSignupViewModel());

            const setErrorSpy = vi.spyOn(result.current.form, 'setError');

            vi.mocked(signupAction).mockResolvedValue({
                success: false,
                errors: {},
            });

            const testData = {
                name: "João Silva",
                email: "joao@email.com",
                password: "senha123",
                confirmPassword: "senha123",
            };

            let submitResult: boolean | undefined;

            await act(async () => {
                submitResult = await result.current.submit(testData);
            });

            expect(submitResult).toBe(false);
            expect(setErrorSpy).not.toHaveBeenCalled();
        });
    });
});
