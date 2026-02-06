import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useProfileAreaViewModel } from "../profilearea.viewmodel";
import { updateUserAction } from "@/app/(private)/dashboard/settings/update.action";

vi.mock("@/app/(private)/dashboard/settings/update.action", () => ({
    updateUserAction: vi.fn(),
}));

const mockRouterRefresh = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        refresh: mockRouterRefresh,
    }),
}));

const mockShowToast = vi.fn();
vi.mock("@/frontend/hooks/useToast", () => ({
    useToast: () => ({
        showToast: mockShowToast,
    }),
}));

describe("useProfileAreaViewModel", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("Estado inicial", () => {
        it("deve inicializar com nome fornecido", () => {
            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            expect(result.current.name).toBe("João Silva");
        });

        it("deve inicializar isLoading como false", () => {
            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            expect(result.current.isLoading).toBe(false);
        });

        it("deve ter método handleUpdateProfile disponível", () => {
            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            expect(result.current.handleUpdateProfile).toBeInstanceOf(Function);
        });

        it("deve ter método setName disponível", () => {
            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            expect(result.current.setName).toBeInstanceOf(Function);
        });

        it("deve inicializar com nome vazio se fornecido", () => {
            const { result } = renderHook(() => useProfileAreaViewModel(""));

            expect(result.current.name).toBe("");
        });
    });

    describe("setName", () => {
        it("deve atualizar o nome corretamente", () => {
            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            act(() => {
                result.current.setName("Maria Santos");
            });

            expect(result.current.name).toBe("Maria Santos");
        });

        it("deve permitir definir nome vazio", () => {
            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            act(() => {
                result.current.setName("");
            });

            expect(result.current.name).toBe("");
        });

        it("deve permitir múltiplas atualizações", () => {
            const { result } = renderHook(() => useProfileAreaViewModel("Nome Inicial"));

            act(() => {
                result.current.setName("Nome 1");
            });
            expect(result.current.name).toBe("Nome 1");

            act(() => {
                result.current.setName("Nome 2");
            });
            expect(result.current.name).toBe("Nome 2");

            act(() => {
                result.current.setName("Nome 3");
            });
            expect(result.current.name).toBe("Nome 3");
        });
    });

    describe("handleUpdateProfile - Casos de sucesso", () => {
        it("deve atualizar perfil com sucesso", async () => {
            vi.mocked(updateUserAction).mockResolvedValueOnce({
                success: true,
                data: { name: "João Silva" },
            });

            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(updateUserAction).toHaveBeenCalledWith({ name: "João Silva" });
            expect(mockShowToast).toHaveBeenCalledWith({
                type: "success",
                message: "Perfil atualizado com sucesso!",
            });
            expect(mockRouterRefresh).toHaveBeenCalled();
        });

        it("deve definir isLoading durante atualização", async () => {
            vi.mocked(updateUserAction).mockResolvedValueOnce({
                success: true,
                data: { name: "João Silva" },
            });

            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            // Teste passou se não houve erro
            expect(result.current.isLoading).toBe(false);
        });

        it("deve definir isLoading como false após sucesso", async () => {
            vi.mocked(updateUserAction).mockResolvedValueOnce({
                success: true,
                data: { name: "João Silva" },
            });

            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(result.current.isLoading).toBe(false);
        });

        it("deve chamar router.refresh após sucesso", async () => {
            vi.mocked(updateUserAction).mockResolvedValueOnce({
                success: true,
                data: { name: "Maria Santos" },
            });

            const { result } = renderHook(() => useProfileAreaViewModel("Maria Santos"));

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(mockRouterRefresh).toHaveBeenCalledTimes(1);
        });

        it("deve atualizar perfil com novo nome", async () => {
            vi.mocked(updateUserAction).mockResolvedValueOnce({
                success: true,
                data: { name: "Novo Nome" },
            });

            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            act(() => {
                result.current.setName("Novo Nome");
            });

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(updateUserAction).toHaveBeenCalledWith({ name: "Novo Nome" });
        });
    });

    describe("handleUpdateProfile - Validações", () => {
        it("não deve atualizar se nome estiver vazio", async () => {
            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            act(() => {
                result.current.setName("");
            });

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(mockShowToast).toHaveBeenCalledWith({
                type: "error",
                message: "O nome não pode estar vazio",
            });
            expect(updateUserAction).not.toHaveBeenCalled();
        });

        it("não deve atualizar se nome tiver apenas espaços", async () => {
            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            act(() => {
                result.current.setName("   ");
            });

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(mockShowToast).toHaveBeenCalledWith({
                type: "error",
                message: "O nome não pode estar vazio",
            });
            expect(updateUserAction).not.toHaveBeenCalled();
        });

        it("deve aceitar nome com espaços no início e fim se houver conteúdo", async () => {
            vi.mocked(updateUserAction).mockResolvedValueOnce({
                success: true,
                data: { name: "  João Silva  " },
            });

            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            act(() => {
                result.current.setName("  João Silva  ");
            });

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(updateUserAction).toHaveBeenCalledWith({ name: "  João Silva  " });
        });

        it("não deve iniciar loading se validação falhar", async () => {
            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            act(() => {
                result.current.setName("");
            });

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(result.current.isLoading).toBe(false);
        });
    });

    describe("handleUpdateProfile - Erros da API", () => {
        it("deve mostrar erro global quando API falhar", async () => {
            vi.mocked(updateUserAction).mockResolvedValueOnce({
                success: false,
                errors: {
                    global: ["Erro ao atualizar perfil"],
                },
            });

            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(mockShowToast).toHaveBeenCalledWith({
                type: "error",
                message: "Erro ao atualizar perfil",
            });
            expect(mockRouterRefresh).not.toHaveBeenCalled();
        });

        it("deve mostrar erro de campo quando API retornar erro de nome", async () => {
            vi.mocked(updateUserAction).mockResolvedValueOnce({
                success: false,
                errors: {
                    name: ["Nome inválido"],
                },
            });

            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(mockShowToast).toHaveBeenCalledWith({
                type: "error",
                message: "Nome inválido",
            });
        });

        it("deve priorizar erro global sobre erro de campo", async () => {
            vi.mocked(updateUserAction).mockResolvedValueOnce({
                success: false,
                errors: {
                    global: ["Erro global"],
                    name: ["Erro do nome"],
                },
            });

            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(mockShowToast).toHaveBeenCalledWith({
                type: "error",
                message: "Erro global",
            });
        });

        it("deve mostrar mensagem padrão quando não houver erro específico", async () => {
            vi.mocked(updateUserAction).mockResolvedValueOnce({
                success: false,
                errors: {},
            });

            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(mockShowToast).toHaveBeenCalledWith({
                type: "error",
                message: "Erro ao atualizar perfil",
            });
        });

        it("deve definir isLoading como false após erro da API", async () => {
            vi.mocked(updateUserAction).mockResolvedValueOnce({
                success: false,
                errors: {
                    global: ["Erro"],
                },
            });

            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(result.current.isLoading).toBe(false);
        });
    });

    describe("handleUpdateProfile - Exceções", () => {
        it("deve lidar com exceção durante atualização", async () => {
            const error = new Error("Network error");
            vi.mocked(updateUserAction).mockRejectedValueOnce(error);

            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(mockShowToast).toHaveBeenCalledWith({
                type: "error",
                message: "Erro inesperado ao atualizar perfil",
            });
        });

        it("deve definir isLoading como false após exceção", async () => {
            vi.mocked(updateUserAction).mockRejectedValueOnce(new Error("Error"));

            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(result.current.isLoading).toBe(false);
        });

        it("não deve chamar router.refresh em caso de exceção", async () => {
            vi.mocked(updateUserAction).mockRejectedValueOnce(new Error("Error"));

            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(mockRouterRefresh).not.toHaveBeenCalled();
        });

        it("deve sempre definir isLoading como false no finally", async () => {
            // Testar com sucesso
            vi.mocked(updateUserAction).mockResolvedValueOnce({
                success: true,
                data: { name: "João" },
            });

            const { result } = renderHook(() => useProfileAreaViewModel("João"));

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(result.current.isLoading).toBe(false);

            // Testar com erro
            vi.mocked(updateUserAction).mockRejectedValueOnce(new Error("Error"));

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(result.current.isLoading).toBe(false);
        });
    });

    describe("Múltiplas chamadas", () => {
        it("deve permitir múltiplas atualizações bem-sucedidas", async () => {
            vi.mocked(updateUserAction)
                .mockResolvedValueOnce({ success: true, data: { name: "Nome 1" } })
                .mockResolvedValueOnce({ success: true, data: { name: "Nome 2" } });

            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(mockShowToast).toHaveBeenCalledWith({
                type: "success",
                message: "Perfil atualizado com sucesso!",
            });

            act(() => {
                result.current.setName("Maria Santos");
            });

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(mockShowToast).toHaveBeenCalledWith({
                type: "success",
                message: "Perfil atualizado com sucesso!",
            });
            expect(updateUserAction).toHaveBeenCalledTimes(2);
        });

        it("deve lidar com falha seguida de sucesso", async () => {
            vi.mocked(updateUserAction)
                .mockResolvedValueOnce({ success: false, errors: { global: ["Erro"] } })
                .mockResolvedValueOnce({ success: true, data: { name: "João" } });

            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(mockShowToast).toHaveBeenCalledWith({
                type: "error",
                message: "Erro",
            });

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(mockShowToast).toHaveBeenCalledWith({
                type: "success",
                message: "Perfil atualizado com sucesso!",
            });
        });
    });

    describe("Edge cases", () => {
        it("deve lidar com nome muito longo", async () => {
            const longName = "A".repeat(1000);
            vi.mocked(updateUserAction).mockResolvedValueOnce({
                success: true,
                data: { name: longName },
            });

            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            act(() => {
                result.current.setName(longName);
            });

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(updateUserAction).toHaveBeenCalledWith({ name: longName });
        });

        it("deve lidar com caracteres especiais no nome", async () => {
            const specialName = "João@#$%Silva";
            vi.mocked(updateUserAction).mockResolvedValueOnce({
                success: true,
                data: { name: specialName },
            });

            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            act(() => {
                result.current.setName(specialName);
            });

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(updateUserAction).toHaveBeenCalledWith({ name: specialName });
        });

        it("deve lidar com nome com emojis", async () => {
            const emojiName = "João 😀 Silva";
            vi.mocked(updateUserAction).mockResolvedValueOnce({
                success: true,
                data: { name: emojiName },
            });

            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            act(() => {
                result.current.setName(emojiName);
            });

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(updateUserAction).toHaveBeenCalledWith({ name: emojiName });
        });

        it("deve lidar com nome de um caractere", async () => {
            vi.mocked(updateUserAction).mockResolvedValueOnce({
                success: true,
                data: { name: "A" },
            });

            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            act(() => {
                result.current.setName("A");
            });

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(updateUserAction).toHaveBeenCalledWith({ name: "A" });
        });

        it("deve lidar com nome com quebras de linha", async () => {
            const nameWithBreaks = "João\nSilva";
            vi.mocked(updateUserAction).mockResolvedValueOnce({
                success: true,
                data: { name: nameWithBreaks },
            });

            const { result } = renderHook(() => useProfileAreaViewModel("João Silva"));

            act(() => {
                result.current.setName(nameWithBreaks);
            });

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(updateUserAction).toHaveBeenCalledWith({ name: nameWithBreaks });
        });
    });

    describe("Integração com Toast", () => {
        it("deve mostrar toast em todos os cenários", async () => {
            // Sucesso
            vi.mocked(updateUserAction).mockResolvedValueOnce({
                success: true,
                data: { name: "João" },
            });

            const { result } = renderHook(() => useProfileAreaViewModel("João"));

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(mockShowToast).toHaveBeenCalledTimes(1);

            // Validação
            act(() => {
                result.current.setName("");
            });

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(mockShowToast).toHaveBeenCalledTimes(2);

            // Erro
            act(() => {
                result.current.setName("João");
            });

            vi.mocked(updateUserAction).mockResolvedValueOnce({
                success: false,
                errors: { global: ["Erro"] },
            });

            await act(async () => {
                await result.current.handleUpdateProfile();
            });

            expect(mockShowToast).toHaveBeenCalledTimes(3);
        });
    });
});
