import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useGraphicViewModel } from "../graphic.viewmodel";
import { ContentData } from "../graphic.model";

describe("useGraphicViewModel", () => {
  describe("quando não há conteúdos", () => {
    it("deve retornar chartData vazio quando contents é array vazio", () => {
      const { result } = renderHook(() =>
        useGraphicViewModel({ contents: [] })
      );

      expect(result.current.chartData).toEqual([]);
      expect(result.current.hasData).toBe(false);
      expect(result.current.totalContent).toBe(0);
    });
  });

  describe("quando há conteúdos", () => {
    it("deve agrupar conteúdos por dia da semana corretamente", () => {
      const mockContents: ContentData[] = [
        {
          id: 1,
          headline: "Teste 1",
          description: "Desc 1",
          cta: "CTA 1",
          hashtags: "#test",
          platform: "instagram",
          createdAt: new Date("2024-01-01T12:00:00"),
          updatedAt: new Date("2024-01-01T12:00:00"),
          userId: 1,
        },
        {
          id: 2,
          headline: "Teste 2",
          description: "Desc 2",
          cta: "CTA 2",
          hashtags: "#test",
          platform: "facebook",
          createdAt: new Date("2024-01-01T15:00:00"),
          updatedAt: new Date("2024-01-01T15:00:00"),
          userId: 1,
        },
        {
          id: 3,
          headline: "Teste 3",
          description: "Desc 3",
          cta: "CTA 3",
          hashtags: "#test",
          platform: "twitter",
          createdAt: new Date("2024-01-03T12:00:00"),
          updatedAt: new Date("2024-01-03T12:00:00"),
          userId: 1,
        },
      ];

      const { result } = renderHook(() =>
        useGraphicViewModel({ contents: mockContents })
      );

      expect(result.current.chartData).toHaveLength(7);
      expect(result.current.chartData[0]).toEqual({ name: "Seg", v: 2 });
      expect(result.current.chartData[2]).toEqual({ name: "Qua", v: 1 });
      expect(result.current.hasData).toBe(true);
      expect(result.current.totalContent).toBe(3);
    });

    it("deve retornar chartData na ordem correta (Seg a Dom)", () => {
      const mockContents: ContentData[] = [
        {
          id: 1,
          headline: "Teste",
          description: "Desc",
          cta: "CTA",
          hashtags: "#test",
          platform: "instagram",
          createdAt: new Date("2024-01-07T12:00:00"),
          updatedAt: new Date("2024-01-07T12:00:00"),
          userId: 1,
        },
      ];

      const { result } = renderHook(() =>
        useGraphicViewModel({ contents: mockContents })
      );

      const days = result.current.chartData.map((d) => d.name);
      expect(days).toEqual(["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"]);
    });

    it("deve contar múltiplos conteúdos no mesmo dia", () => {
      const mockContents: ContentData[] = [
        {
          id: 1,
          headline: "Teste 1",
          description: "Desc",
          cta: "CTA",
          hashtags: "#test",
          platform: "instagram",
          createdAt: new Date("2024-01-05T10:00:00"),
          updatedAt: new Date("2024-01-05T10:00:00"),
          userId: 1,
        },
        {
          id: 2,
          headline: "Teste 2",
          description: "Desc",
          cta: "CTA",
          hashtags: "#test",
          platform: "facebook",
          createdAt: new Date("2024-01-05T14:00:00"),
          updatedAt: new Date("2024-01-05T14:00:00"),
          userId: 1,
        },
        {
          id: 3,
          headline: "Teste 3",
          description: "Desc",
          cta: "CTA",
          hashtags: "#test",
          platform: "twitter",
          createdAt: new Date("2024-01-05T18:00:00"),
          updatedAt: new Date("2024-01-05T18:00:00"),
          userId: 1,
        },
      ];

      const { result } = renderHook(() =>
        useGraphicViewModel({ contents: mockContents })
      );

      const sexta = result.current.chartData.find((d) => d.name === "Sex");
      expect(sexta?.v).toBe(3);
    });

    it("deve ter valor 0 para dias sem conteúdo", () => {
      const mockContents: ContentData[] = [
        {
          id: 1,
          headline: "Teste",
          description: "Desc",
          cta: "CTA",
          hashtags: "#test",
          platform: "instagram",
          createdAt: new Date("2024-01-01T12:00:00"),
          updatedAt: new Date("2024-01-01T12:00:00"),
          userId: 1,
        },
      ];

      const { result } = renderHook(() =>
        useGraphicViewModel({ contents: mockContents })
      );

      const terca = result.current.chartData.find((d) => d.name === "Ter");
      const quarta = result.current.chartData.find((d) => d.name === "Qua");
      const quinta = result.current.chartData.find((d) => d.name === "Qui");

      expect(terca?.v).toBe(0);
      expect(quarta?.v).toBe(0);
      expect(quinta?.v).toBe(0);
    });
  });

  describe("hasData", () => {
    it("deve retornar true quando há conteúdos", () => {
      const mockContents: ContentData[] = [
        {
          id: 1,
          headline: "Teste",
          description: "Desc",
          cta: "CTA",
          hashtags: "#test",
          platform: "instagram",
          createdAt: new Date("2024-01-01T12:00:00"),
          updatedAt: new Date("2024-01-01T12:00:00"),
          userId: 1,
        },
      ];

      const { result } = renderHook(() =>
        useGraphicViewModel({ contents: mockContents })
      );

      expect(result.current.hasData).toBe(true);
    });

    it("deve retornar false quando não há conteúdos", () => {
      const { result } = renderHook(() =>
        useGraphicViewModel({ contents: [] })
      );

      expect(result.current.hasData).toBe(false);
    });
  });

  describe("totalContent", () => {
    it("deve retornar o total de conteúdos", () => {
      const mockContents: ContentData[] = [
        {
          id: 1,
          headline: "Teste 1",
          description: "Desc",
          cta: "CTA",
          hashtags: "#test",
          platform: "instagram",
          createdAt: new Date("2024-01-01T12:00:00"),
          updatedAt: new Date("2024-01-01T12:00:00"),
          userId: 1,
        },
        {
          id: 2,
          headline: "Teste 2",
          description: "Desc",
          cta: "CTA",
          hashtags: "#test",
          platform: "facebook",
          createdAt: new Date("2024-01-02T12:00:00"),
          updatedAt: new Date("2024-01-02T12:00:00"),
          userId: 1,
        },
      ];

      const { result } = renderHook(() =>
        useGraphicViewModel({ contents: mockContents })
      );

      expect(result.current.totalContent).toBe(2);
    });

    it("deve retornar 0 quando não há conteúdos", () => {
      const { result } = renderHook(() =>
        useGraphicViewModel({ contents: [] })
      );

      expect(result.current.totalContent).toBe(0);
    });
  });
});
