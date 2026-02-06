import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import useResetViewModel from "../reset.viewmodel";
import { resetAction } from "@/app/(public)/auth/forget/reset/reset.action";

vi.mock("@/app/(public)/auth/forget/reset/reset.action", () => ({
  resetAction: vi.fn(),
}));

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("useResetViewModel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Estado inicial", () => {
    it("deve inicializar com valores padrão corretos", () => {
      const { result } = renderHook(() => useResetViewModel());

      expect(result.current.form).toBeDefined();
      expect(result.current.submit).toBeInstanceOf(Function);
      expect(result.current.isSubmitting).toBe(false);
    });

    it("deve ter form com validação zod configurada", () => {
      const { result } = renderHook(() => useResetViewModel());

      expect(result.current.form.formState).toBeDefined();
      expect(result.current.form.handleSubmit).toBeInstanceOf(Function);
      expect(result.current.form.setError).toBeInstanceOf(Function);
    });
  });

  describe("submit - Casos de sucesso", () => {
    it("deve resetar senha com sucesso e redirecionar para dashboard", async () => {
      const { result } = renderHook(() => useResetViewModel());

      vi.mocked(resetAction).mockResolvedValue({
        success: true,
      });

      const testData = {
        token: "valid-token-123",
        email: "teste@email.com",
        password: "senha123",
        confirmPassword: "senha123",
      };

      let submitResult: boolean | undefined;

      await act(async () => {
        submitResult = await result.current.submit(testData);
      });

      expect(resetAction).toHaveBeenCalledWith(testData);
      expect(submitResult).toBe(true);
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });

    it("deve retornar true quando a action for bem-sucedida", async () => {
      const { result } = renderHook(() => useResetViewModel());

      vi.mocked(resetAction).mockResolvedValue({
        success: true,
      });

      const testData = {
        token: "token123",
        email: "usuario@teste.com",
        password: "novaSenha123",
        confirmPassword: "novaSenha123",
      };

      let submitResult: boolean | undefined;

      await act(async () => {
        submitResult = await result.current.submit(testData);
      });

      expect(submitResult).toBe(true);
    });

    it("deve chamar resetAction com todos os dados corretos", async () => {
      const { result } = renderHook(() => useResetViewModel());

      vi.mocked(resetAction).mockResolvedValue({
        success: true,
      });

      const testData = {
        token: "abc123def456",
        email: "user@example.com",
        password: "strongPass123!",
        confirmPassword: "strongPass123!",
      };

      await act(async () => {
        await result.current.submit(testData);
      });

      expect(resetAction).toHaveBeenCalledWith(testData);
      expect(resetAction).toHaveBeenCalledTimes(1);
    });
  });

  describe("submit - Casos de erro", () => {
    it("deve definir erro no campo token quando a validação falhar", async () => {
      const { result } = renderHook(() => useResetViewModel());

      const setErrorSpy = vi.spyOn(result.current.form, "setError");

      vi.mocked(resetAction).mockResolvedValue({
        success: false,
        errors: {
          token: ["Token inválido"],
        },
      });

      const testData = {
        token: "",
        email: "teste@email.com",
        password: "senha123",
        confirmPassword: "senha123",
      };

      await act(async () => {
        await result.current.submit(testData);
      });

      expect(setErrorSpy).toHaveBeenCalledWith("token", {
        message: "Token inválido",
      });
    });

    it("deve definir erro no campo email quando a validação falhar", async () => {
      const { result } = renderHook(() => useResetViewModel());

      const setErrorSpy = vi.spyOn(result.current.form, "setError");

      vi.mocked(resetAction).mockResolvedValue({
        success: false,
        errors: {
          email: ["Email inválido"],
        },
      });

      const testData = {
        token: "token123",
        email: "email-invalido",
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

    it("deve definir erro no campo password quando a validação falhar", async () => {
      const { result } = renderHook(() => useResetViewModel());

      const setErrorSpy = vi.spyOn(result.current.form, "setError");

      vi.mocked(resetAction).mockResolvedValue({
        success: false,
        errors: {
          password: ["Senha muito curta"],
        },
      });

      const testData = {
        token: "token123",
        email: "teste@email.com",
        password: "123",
        confirmPassword: "123",
      };

      await act(async () => {
        await result.current.submit(testData);
      });

      expect(setErrorSpy).toHaveBeenCalledWith("password", {
        message: "Senha muito curta",
      });
    });

    it("deve definir erro no campo confirmPassword quando as senhas não conferirem", async () => {
      const { result } = renderHook(() => useResetViewModel());

      const setErrorSpy = vi.spyOn(result.current.form, "setError");

      vi.mocked(resetAction).mockResolvedValue({
        success: false,
        errors: {
          confirmPassword: ["As senhas não conferem"],
        },
      });

      const testData = {
        token: "token123",
        email: "teste@email.com",
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
      const { result } = renderHook(() => useResetViewModel());

      vi.mocked(resetAction).mockResolvedValue({
        success: false,
        errors: {
          token: ["Token expirado"],
        },
      });

      const testData = {
        token: "expired-token",
        email: "teste@email.com",
        password: "senha123",
        confirmPassword: "senha123",
      };

      let submitResult: boolean | undefined;

      await act(async () => {
        submitResult = await result.current.submit(testData);
      });

      expect(submitResult).toBe(false);
    });

    it("deve redirecionar para dashboard mesmo quando houver erro", async () => {
      const { result } = renderHook(() => useResetViewModel());

      vi.mocked(resetAction).mockResolvedValue({
        success: false,
        errors: {
          token: ["Erro ao processar"],
        },
      });

      const testData = {
        token: "token123",
        email: "teste@email.com",
        password: "senha123",
        confirmPassword: "senha123",
      };

      await act(async () => {
        await result.current.submit(testData);
      });

      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });

    it("deve lidar com múltiplas mensagens de erro no mesmo campo", async () => {
      const { result } = renderHook(() => useResetViewModel());

      const setErrorSpy = vi.spyOn(result.current.form, "setError");

      vi.mocked(resetAction).mockResolvedValue({
        success: false,
        errors: {
          password: ["Senha muito curta", "Senha obrigatória"],
        },
      });

      const testData = {
        token: "token123",
        email: "teste@email.com",
        password: "",
        confirmPassword: "",
      };

      await act(async () => {
        await result.current.submit(testData);
      });

      expect(setErrorSpy).toHaveBeenCalledWith("password", {
        message: "Senha muito curta",
      });
    });

    it("deve definir erros em múltiplos campos simultaneamente", async () => {
      const { result } = renderHook(() => useResetViewModel());

      const setErrorSpy = vi.spyOn(result.current.form, "setError");

      vi.mocked(resetAction).mockResolvedValue({
        success: false,
        errors: {
          token: ["Token inválido"],
          email: ["Email inválido"],
          password: ["Senha muito curta"],
          confirmPassword: ["As senhas não conferem"],
        },
      });

      const testData = {
        token: "",
        email: "invalido",
        password: "123",
        confirmPassword: "456",
      };

      await act(async () => {
        await result.current.submit(testData);
      });

      expect(setErrorSpy).toHaveBeenCalledWith("token", {
        message: "Token inválido",
      });
      expect(setErrorSpy).toHaveBeenCalledWith("email", {
        message: "Email inválido",
      });
      expect(setErrorSpy).toHaveBeenCalledWith("password", {
        message: "Senha muito curta",
      });
      expect(setErrorSpy).toHaveBeenCalledWith("confirmPassword", {
        message: "As senhas não conferem",
      });
    });

    it("deve ignorar campos de erro vazios", async () => {
      const { result } = renderHook(() => useResetViewModel());

      vi.mocked(resetAction).mockResolvedValue({
        success: false,
        errors: {
          token: [],
          email: [],
        },
      });

      const testData = {
        token: "token123",
        email: "teste@email.com",
        password: "senha123",
        confirmPassword: "senha123",
      };

      await act(async () => {
        await result.current.submit(testData);
      });

      expect(result.current.form.formState.errors.token).toBeUndefined();
      expect(result.current.form.formState.errors.email).toBeUndefined();
    });

    it("deve lidar com erros globais", async () => {
      const { result } = renderHook(() => useResetViewModel());

      vi.mocked(resetAction).mockResolvedValue({
        success: false,
        errors: {
          global: ["Erro ao resetar senha"],
        },
      });

      const testData = {
        token: "token123",
        email: "teste@email.com",
        password: "senha123",
        confirmPassword: "senha123",
      };

      let submitResult: boolean | undefined;

      await act(async () => {
        submitResult = await result.current.submit(testData);
      });

      expect(submitResult).toBe(false);
    });
  });

  describe("isSubmitting", () => {
    it("deve refletir o estado de submissão do formulário", async () => {
      const { result } = renderHook(() => useResetViewModel());

      expect(result.current.isSubmitting).toBe(false);

      vi.mocked(resetAction).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ success: true }),
              100
            )
          )
      );

      const testData = {
        token: "token123",
        email: "teste@email.com",
        password: "senha123",
        confirmPassword: "senha123",
      };

      act(() => {
        result.current.form.handleSubmit(
          async (data) => await result.current.submit(data)
        )();
      });

      await waitFor(() => {
        expect(result.current.isSubmitting).toBe(true);
      });

      await waitFor(
        () => {
          expect(result.current.isSubmitting).toBe(false);
        },
        { timeout: 200 }
      );
    });

    it("deve ser false inicialmente", () => {
      const { result } = renderHook(() => useResetViewModel());

      expect(result.current.isSubmitting).toBe(false);
    });

    it("deve voltar a false após submissão bem-sucedida", async () => {
      const { result } = renderHook(() => useResetViewModel());

      vi.mocked(resetAction).mockResolvedValue({
        success: true,
      });

      const testData = {
        token: "token123",
        email: "teste@email.com",
        password: "senha123",
        confirmPassword: "senha123",
      };

      await act(async () => {
        await result.current.submit(testData);
      });

      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe("Integração com react-hook-form", () => {
    it("deve limpar erros quando o formulário for redefinido", async () => {
      const { result } = renderHook(() => useResetViewModel());

      const setErrorSpy = vi.spyOn(result.current.form, "setError");
      const resetSpy = vi.spyOn(result.current.form, "reset");

      vi.mocked(resetAction).mockResolvedValue({
        success: false,
        errors: {
          email: ["Email inválido"],
        },
      });

      const testData = {
        token: "token123",
        email: "invalido",
        password: "senha123",
        confirmPassword: "senha123",
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
      const { result } = renderHook(() => useResetViewModel());

      act(() => {
        result.current.form.setValue("email", "manual@email.com");
        result.current.form.setValue("token", "manual-token");
        result.current.form.setValue("password", "manual123");
        result.current.form.setValue("confirmPassword", "manual123");
      });

      expect(result.current.form.getValues("email")).toBe("manual@email.com");
      expect(result.current.form.getValues("token")).toBe("manual-token");
      expect(result.current.form.getValues("password")).toBe("manual123");
      expect(result.current.form.getValues("confirmPassword")).toBe("manual123");
    });

    it("deve permitir obter todos os valores do formulário", () => {
      const { result } = renderHook(() => useResetViewModel());

      act(() => {
        result.current.form.setValue("email", "test@email.com");
        result.current.form.setValue("token", "test-token");
        result.current.form.setValue("password", "test123");
        result.current.form.setValue("confirmPassword", "test123");
      });

      const values = result.current.form.getValues();

      expect(values).toEqual({
        email: "test@email.com",
        token: "test-token",
        password: "test123",
        confirmPassword: "test123",
      });
    });

    it("deve ter métodos de formulário disponíveis", () => {
      const { result } = renderHook(() => useResetViewModel());

      expect(result.current.form.register).toBeInstanceOf(Function);
      expect(result.current.form.handleSubmit).toBeInstanceOf(Function);
      expect(result.current.form.reset).toBeInstanceOf(Function);
      expect(result.current.form.setError).toBeInstanceOf(Function);
      expect(result.current.form.setValue).toBeInstanceOf(Function);
      expect(result.current.form.getValues).toBeInstanceOf(Function);
    });
  });

  describe("Comportamento do router", () => {
    it("deve chamar router.push apenas uma vez", async () => {
      const { result } = renderHook(() => useResetViewModel());

      vi.mocked(resetAction).mockResolvedValue({
        success: true,
      });

      const testData = {
        token: "token123",
        email: "teste@email.com",
        password: "senha123",
        confirmPassword: "senha123",
      };

      await act(async () => {
        await result.current.submit(testData);
      });

      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });

    it("deve sempre redirecionar para /dashboard independente do resultado", async () => {
      const { result } = renderHook(() => useResetViewModel());

      vi.mocked(resetAction).mockResolvedValue({
        success: false,
        errors: {
          token: ["Token inválido"],
        },
      });

      const testData = {
        token: "token123",
        email: "teste@email.com",
        password: "senha123",
        confirmPassword: "senha123",
      };

      await act(async () => {
        await result.current.submit(testData);
      });

      expect(mockPush).toHaveBeenCalledWith("/dashboard");

      vi.clearAllMocks();

      vi.mocked(resetAction).mockResolvedValue({
        success: true,
      });

      await act(async () => {
        await result.current.submit(testData);
      });

      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  describe("Tratamento de dados", () => {
    it("deve aceitar dados com formato correto", async () => {
      const { result } = renderHook(() => useResetViewModel());

      vi.mocked(resetAction).mockResolvedValue({
        success: true,
      });

      const testData = {
        token: "valid-token-with-numbers-123",
        email: "usuario.teste@dominio.com.br",
        password: "SenhaForte123!@#",
        confirmPassword: "SenhaForte123!@#",
      };

      await act(async () => {
        await result.current.submit(testData);
      });

      expect(resetAction).toHaveBeenCalledWith(testData);
    });

    it("deve lidar com tokens longos", async () => {
      const { result } = renderHook(() => useResetViewModel());

      vi.mocked(resetAction).mockResolvedValue({
        success: true,
      });

      const longToken = "a".repeat(100);

      const testData = {
        token: longToken,
        email: "teste@email.com",
        password: "senha123",
        confirmPassword: "senha123",
      };

      await act(async () => {
        await result.current.submit(testData);
      });

      expect(resetAction).toHaveBeenCalledWith(testData);
    });

    it("deve lidar com senhas complexas", async () => {
      const { result } = renderHook(() => useResetViewModel());

      vi.mocked(resetAction).mockResolvedValue({
        success: true,
      });

      const complexPassword = "P@ssw0rd!2024#Complex$";

      const testData = {
        token: "token123",
        email: "teste@email.com",
        password: complexPassword,
        confirmPassword: complexPassword,
      };

      await act(async () => {
        await result.current.submit(testData);
      });

      expect(resetAction).toHaveBeenCalledWith(testData);
    });
  });
});
