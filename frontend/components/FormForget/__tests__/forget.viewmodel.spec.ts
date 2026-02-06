import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import useForgetViewModel from "../forget.viewmodel";
import { forgetAction } from "@/app/(public)/auth/forget/forget.action";

vi.mock("@/app/(public)/auth/forget/forget.action", () => ({
  forgetAction: vi.fn(),
}));

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("useForgetViewModel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Estado inicial", () => {
    it("deve inicializar com valores padrão corretos", () => {
      const { result } = renderHook(() => useForgetViewModel());

      expect(result.current.form).toBeDefined();
      expect(result.current.submit).toBeInstanceOf(Function);
      expect(result.current.isSubmitting).toBe(false);
    });

    it("deve ter form com validação zod configurada", () => {
      const { result } = renderHook(() => useForgetViewModel());

      expect(result.current.form.formState).toBeDefined();
      expect(result.current.form.handleSubmit).toBeInstanceOf(Function);
      expect(result.current.form.setError).toBeInstanceOf(Function);
    });
  });

  describe("submit - Casos de sucesso", () => {
    it("deve enviar email com sucesso e redirecionar", async () => {
      const { result } = renderHook(() => useForgetViewModel());

      vi.mocked(forgetAction).mockResolvedValue({
        success: true,
        message: "Email enviado com sucesso",
      });

      const testData = {
        email: "teste@email.com",
      };

      let submitResult: boolean | undefined;

      await act(async () => {
        submitResult = await result.current.submit(testData);
      });

      expect(forgetAction).toHaveBeenCalledWith(testData);
      expect(submitResult).toBe(true);
      expect(mockPush).toHaveBeenCalledWith("/auth/forget/reset");
    });

    it("deve retornar true quando a action for bem-sucedida", async () => {
      const { result } = renderHook(() => useForgetViewModel());

      vi.mocked(forgetAction).mockResolvedValue({
        success: true,
        message: "Email enviado",
      });

      const testData = { email: "usuario@teste.com" };

      let submitResult: boolean | undefined;

      await act(async () => {
        submitResult = await result.current.submit(testData);
      });

      expect(submitResult).toBe(true);
    });
  });

  describe("submit - Casos de erro", () => {
    it("deve definir erro no campo email quando a validação falhar", async () => {
      const { result } = renderHook(() => useForgetViewModel());

      const setErrorSpy = vi.spyOn(result.current.form, "setError");

      vi.mocked(forgetAction).mockResolvedValue({
        success: false,
        errors: {
          email: ["Email inválido"],
        },
      });

      const testData = { email: "email-invalido" };

      await act(async () => {
        await result.current.submit(testData);
      });

      expect(setErrorSpy).toHaveBeenCalledWith("email", {
        message: "Email inválido",
      });
    });

    it("deve retornar false quando a action falhar", async () => {
      const { result } = renderHook(() => useForgetViewModel());

      vi.mocked(forgetAction).mockResolvedValue({
        success: false,
        errors: {
          email: ["Email não encontrado"],
        },
      });

      const testData = { email: "naoexiste@email.com" };

      let submitResult: boolean | undefined;

      await act(async () => {
        submitResult = await result.current.submit(testData);
      });

      expect(submitResult).toBe(false);
    });

    it("não deve redirecionar quando houver erro", async () => {
      const { result } = renderHook(() => useForgetViewModel());

      vi.mocked(forgetAction).mockResolvedValue({
        success: false,
        errors: {
          email: ["Erro ao processar"],
        },
      });

      const testData = { email: "teste@email.com" };

      await act(async () => {
        await result.current.submit(testData);
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it("deve lidar com múltiplas mensagens de erro no mesmo campo", async () => {
      const { result } = renderHook(() => useForgetViewModel());

      const setErrorSpy = vi.spyOn(result.current.form, "setError");

      vi.mocked(forgetAction).mockResolvedValue({
        success: false,
        errors: {
          email: ["Email inválido", "Email obrigatório"],
        },
      });

      const testData = { email: "" };

      await act(async () => {
        await result.current.submit(testData);
      });

      expect(setErrorSpy).toHaveBeenCalledWith("email", {
        message: "Email inválido",
      });
    });

    it("deve ignorar campos de erro vazios", async () => {
      const { result } = renderHook(() => useForgetViewModel());

      vi.mocked(forgetAction).mockResolvedValue({
        success: false,
        errors: {
          email: [],
        },
      });

      const testData = { email: "teste@email.com" };

      await act(async () => {
        await result.current.submit(testData);
      });

      expect(result.current.form.formState.errors.email).toBeUndefined();
    });
  });

  describe("isSubmitting", () => {
    it("deve refletir o estado de submissão do formulário", async () => {
      const { result } = renderHook(() => useForgetViewModel());

      expect(result.current.isSubmitting).toBe(false);

      vi.mocked(forgetAction).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ success: true, message: "Sucesso" }),
              100
            )
          )
      );

      const testData = { email: "teste@email.com" };

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
  });

  describe("Integração com react-hook-form", () => {
    it("deve limpar erros quando o formulário for redefinido", async () => {
      const { result } = renderHook(() => useForgetViewModel());

      const setErrorSpy = vi.spyOn(result.current.form, "setError");
      const resetSpy = vi.spyOn(result.current.form, "reset");

      vi.mocked(forgetAction).mockResolvedValue({
        success: false,
        errors: {
          email: ["Email inválido"],
        },
      });

      const testData = { email: "invalido" };

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
      const { result } = renderHook(() => useForgetViewModel());

      act(() => {
        result.current.form.setValue("email", "manual@email.com");
      });

      expect(result.current.form.getValues("email")).toBe("manual@email.com");
    });
  });
});
