import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSigninViewModel } from "../signin.viewmodel";
import { renderHook } from "@testing-library/react";
import { signinAction } from "@/app/(public)/auth/signin/signup.action";
import { act } from "react";

vi.mock("@/app/(public)/auth/signin/signup.action", () => ({
    signinAction: vi.fn(),
}));

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

describe("useSigninViewModel", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("Estado inicial", () => {
        it("deve inicializar com valores padrão corretos", () => {
            const { result } = renderHook(() => useSigninViewModel());

            expect(result.current.form).toBeDefined();
            expect(result.current.submit).toBeInstanceOf(Function);
            expect(result.current.isSubmitting).toBe(false);
        });

        it("deve ter form com validação zod configurada", () => {
            const { result } = renderHook(() => useSigninViewModel());

            expect(result.current.form.formState).toBeDefined();
            expect(result.current.form.handleSubmit).toBeInstanceOf(Function);
            expect(result.current.form.setError).toBeInstanceOf(Function);
        });
    });

    describe("submit - Casos de sucesso", () => {
        it("deve redirecionar para dashboard quando a action for bem-sucedida", async () => {
            const { result } = renderHook(() => useSigninViewModel());

            vi.mocked(signinAction).mockResolvedValue({
                success: true,
                data: {
                    email: "teste@email.com",
                    name: "Teste",
                },
            });

            const testData = {
                email: "teste@email.com",
                password: "senha123",
            };

            let submitResult: boolean | undefined;

            await act(async () => {
                submitResult = await result.current.submit(testData);
            });

            expect(signinAction).toHaveBeenCalledWith(testData);
            expect(submitResult).toBe(true);
            expect(mockPush).toHaveBeenCalledWith("/dashboard");
        });

        it("deve retornar true quando a action for bem-sucedida", async () => {
            const { result } = renderHook(() => useSigninViewModel());

            vi.mocked(signinAction).mockResolvedValue({
                success: true,
                data: {
                    email: "usuario@teste.com",
                    name: "Usuario",
                },
            });

            const testData = {
                email: "usuario@teste.com",
                password: "senhaSegura123",
            };

            let submitResult: boolean | undefined;

            await act(async () => {
                submitResult = await result.current.submit(testData);
            });

            expect(submitResult).toBe(true);
        });

        it("deve chamar signinAction com todos os dados corretos", async () => {
            const { result } = renderHook(() => useSigninViewModel());

            vi.mocked(signinAction).mockResolvedValue({
                success: true,
                data: {
                    email: "user@example.com",
                    name: "User",
                },
            });

            const testData = {
                email: "user@example.com",
                password: "strongPass123!",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(signinAction).toHaveBeenCalledWith(testData);
            expect(signinAction).toHaveBeenCalledTimes(1);
        });
    });

    describe("submit - Casos de erro", () => {
        it("deve definir erro no campo email quando a validação falhar", async () => {
            const { result } = renderHook(() => useSigninViewModel());

            const setErrorSpy = vi.spyOn(result.current.form, "setError");

            vi.mocked(signinAction).mockResolvedValue({
                success: false,
                errors: {
                    email: ["Email inválido"],
                },
            });

            const testData = {
                email: "email-invalido",
                password: "senha123",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(setErrorSpy).toHaveBeenCalledWith("email", {
                message: "Email inválido",
            });
        });

        it("deve definir erro no campo password quando a validação falhar", async () => {
            const { result } = renderHook(() => useSigninViewModel());

            const setErrorSpy = vi.spyOn(result.current.form, "setError");

            vi.mocked(signinAction).mockResolvedValue({
                success: false,
                errors: {
                    password: ["Senha muito curta"],
                },
            });

            const testData = {
                email: "teste@email.com",
                password: "123",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(setErrorSpy).toHaveBeenCalledWith("password", {
                message: "Senha muito curta",
            });
        });

        it("deve retornar false quando a action falhar", async () => {
            const { result } = renderHook(() => useSigninViewModel());

            vi.mocked(signinAction).mockResolvedValue({
                success: false,
                errors: {
                    email: ["Credenciais inválidas"],
                },
            });

            const testData = {
                email: "teste@email.com",
                password: "senhaerrada",
            };

            let submitResult: boolean | undefined;

            await act(async () => {
                submitResult = await result.current.submit(testData);
            });

            expect(submitResult).toBe(false);
        });

        it("deve não redirecionar quando houver erro", async () => {
            const { result } = renderHook(() => useSigninViewModel());

            vi.mocked(signinAction).mockResolvedValue({
                success: false,
                errors: {
                    email: ["Email não encontrado"],
                },
            });

            const testData = {
                email: "naoexiste@email.com",
                password: "senha123",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(mockPush).not.toHaveBeenCalled();
        });

        it("deve lidar com múltiplas mensagens de erro no mesmo campo", async () => {
            const { result } = renderHook(() => useSigninViewModel());

            const setErrorSpy = vi.spyOn(result.current.form, "setError");

            vi.mocked(signinAction).mockResolvedValue({
                success: false,
                errors: {
                    password: ["Senha muito curta", "Senha obrigatória"],
                },
            });

            const testData = {
                email: "teste@email.com",
                password: "",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(setErrorSpy).toHaveBeenCalledWith("password", {
                message: "Senha muito curta",
            });
        });

        it("deve definir erros em múltiplos campos simultaneamente", async () => {
            const { result } = renderHook(() => useSigninViewModel());

            const setErrorSpy = vi.spyOn(result.current.form, "setError");

            vi.mocked(signinAction).mockResolvedValue({
                success: false,
                errors: {
                    email: ["Email inválido"],
                    password: ["Senha muito curta"],
                },
            });

            const testData = {
                email: "invalido",
                password: "123",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(setErrorSpy).toHaveBeenCalledWith("email", {
                message: "Email inválido",
            });
            expect(setErrorSpy).toHaveBeenCalledWith("password", {
                message: "Senha muito curta",
            });
        });

        it("deve ignorar campos de erro vazios", async () => {
            const { result } = renderHook(() => useSigninViewModel());

            vi.mocked(signinAction).mockResolvedValue({
                success: false,
                errors: {
                    email: [],
                    password: [],
                },
            });

            const testData = {
                email: "teste@email.com",
                password: "senha123",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(result.current.form.formState.errors.email).toBeUndefined();
            expect(result.current.form.formState.errors.password).toBeUndefined();
        });

        it("deve lidar com erros globais", async () => {
            const { result } = renderHook(() => useSigninViewModel());

            vi.mocked(signinAction).mockResolvedValue({
                success: false,
                errors: {
                    global: ["Erro ao realizar login"],
                },
            });

            const testData = {
                email: "teste@email.com",
                password: "senha123",
            };

            let submitResult: boolean | undefined;

            await act(async () => {
                submitResult = await result.current.submit(testData);
            });

            expect(submitResult).toBe(false);
        });
    });

    describe("isSubmitting", () => {
        it("deve ser false inicialmente", () => {
            const { result } = renderHook(() => useSigninViewModel());

            expect(result.current.isSubmitting).toBe(false);
        });

        it("deve voltar a false após submissão bem-sucedida", async () => {
            const { result } = renderHook(() => useSigninViewModel());

            vi.mocked(signinAction).mockResolvedValue({
                success: true,
                data: {
                    email: "teste@email.com",
                    name: "Teste",
                },
            });

            const testData = {
                email: "teste@email.com",
                password: "senha123",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(result.current.isSubmitting).toBe(false);
        });
    });

    describe("Integração com react-hook-form", () => {
        it("deve limpar erros quando o formulário for redefinido", async () => {
            const { result } = renderHook(() => useSigninViewModel());

            const setErrorSpy = vi.spyOn(result.current.form, "setError");
            const resetSpy = vi.spyOn(result.current.form, "reset");

            vi.mocked(signinAction).mockResolvedValue({
                success: false,
                errors: {
                    email: ["Email inválido"],
                },
            });

            const testData = {
                email: "invalido",
                password: "senha123",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(setErrorSpy).toHaveBeenCalledWith("email", {
                message: "Email inválido",
            });

            act(() => {
                result.current.form.reset();
            });

            expect(resetSpy).toHaveBeenCalled();
        });

        it("deve permitir definir valores de campo manualmente", () => {
            const { result } = renderHook(() => useSigninViewModel());

            act(() => {
                result.current.form.setValue("email", "manual@email.com");
                result.current.form.setValue("password", "manual123");
            });

            expect(result.current.form.getValues("email")).toBe("manual@email.com");
            expect(result.current.form.getValues("password")).toBe("manual123");
        });

        it("deve permitir obter todos os valores do formulário", () => {
            const { result } = renderHook(() => useSigninViewModel());

            act(() => {
                result.current.form.setValue("email", "test@email.com");
                result.current.form.setValue("password", "test123");
            });

            const values = result.current.form.getValues();

            expect(values).toEqual({
                email: "test@email.com",
                password: "test123",
            });
        });

        it("deve ter métodos de formulário disponíveis", () => {
            const { result } = renderHook(() => useSigninViewModel());

            expect(result.current.form.register).toBeInstanceOf(Function);
            expect(result.current.form.handleSubmit).toBeInstanceOf(Function);
            expect(result.current.form.reset).toBeInstanceOf(Function);
            expect(result.current.form.setError).toBeInstanceOf(Function);
            expect(result.current.form.setValue).toBeInstanceOf(Function);
            expect(result.current.form.getValues).toBeInstanceOf(Function);
        });
    });

    describe("Comportamento do router", () => {
        it("deve chamar router.push apenas uma vez em caso de sucesso", async () => {
            const { result } = renderHook(() => useSigninViewModel());

            vi.mocked(signinAction).mockResolvedValue({
                success: true,
                data: {
                    email: "teste@email.com",
                    name: "Teste",
                },
            });

            const testData = {
                email: "teste@email.com",
                password: "senha123",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(mockPush).toHaveBeenCalledTimes(1);
            expect(mockPush).toHaveBeenCalledWith("/dashboard");
        });

        it("não deve redirecionar quando o login falhar", async () => {
            const { result } = renderHook(() => useSigninViewModel());

            vi.mocked(signinAction).mockResolvedValue({
                success: false,
                errors: {
                    email: ["Credenciais inválidas"],
                },
            });

            const testData = {
                email: "teste@email.com",
                password: "senhaerrada",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(mockPush).not.toHaveBeenCalled();
        });
    });

    describe("Tratamento de dados", () => {
        it("deve aceitar dados com formato correto", async () => {
            const { result } = renderHook(() => useSigninViewModel());

            vi.mocked(signinAction).mockResolvedValue({
                success: true,
                data: {
                    email: "usuario.teste@dominio.com.br",
                    name: "Usuario",
                },
            });

            const testData = {
                email: "usuario.teste@dominio.com.br",
                password: "SenhaForte123!@#",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(signinAction).toHaveBeenCalledWith(testData);
        });

        it("deve lidar com senhas complexas", async () => {
            const { result } = renderHook(() => useSigninViewModel());

            vi.mocked(signinAction).mockResolvedValue({
                success: true,
                data: {
                    email: "teste@email.com",
                    name: "Teste",
                },
            });

            const complexPassword = "P@ssw0rd!2024#Complex$";

            const testData = {
                email: "teste@email.com",
                password: complexPassword,
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(signinAction).toHaveBeenCalledWith(testData);
        });

        it("deve preservar espaços no email", async () => {
            const { result } = renderHook(() => useSigninViewModel());

            vi.mocked(signinAction).mockResolvedValue({
                success: false,
                errors: {
                    email: ["Email com espaços inválido"],
                },
            });

            const testData = {
                email: " teste@email.com ",
                password: "senha123",
            };

            await act(async () => {
                await result.current.submit(testData);
            });

            expect(signinAction).toHaveBeenCalledWith(testData);
        });
    });

    describe("Cenários de erro de rede/servidor", () => {
        it("deve lidar com falha completa da action", async () => {
            const { result } = renderHook(() => useSigninViewModel());

            vi.mocked(signinAction).mockResolvedValue({
                success: false,
                errors: {},
            });

            const testData = {
                email: "teste@email.com",
                password: "senha123",
            };

            let submitResult: boolean | undefined;

            await act(async () => {
                submitResult = await result.current.submit(testData);
            });

            expect(submitResult).toBe(false);
            expect(mockPush).not.toHaveBeenCalled();
        });
    });
});