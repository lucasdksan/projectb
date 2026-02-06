import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { GraphicView } from "../graphic.view";
import { ContentData } from "../graphic.model";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  AreaChart: ({ children }: any) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

vi.mock("../graphic.viewmodel", () => ({
  useGraphicViewModel: vi.fn(),
}));

import { useGraphicViewModel } from "../graphic.viewmodel";

describe("GraphicView", () => {
  describe("quando não há dados", () => {
    it("deve exibir mensagem quando não há conteúdo", () => {
      vi.mocked(useGraphicViewModel).mockReturnValue({
        chartData: [],
        hasData: false,
        totalContent: 0,
      });

      render(<GraphicView contents={[]} />);

      expect(
        screen.getByText("Nenhum conteúdo gerado ainda")
      ).toBeInTheDocument();
    });

    it("não deve renderizar o gráfico quando não há dados", () => {
      vi.mocked(useGraphicViewModel).mockReturnValue({
        chartData: [],
        hasData: false,
        totalContent: 0,
      });

      render(<GraphicView contents={[]} />);

      expect(
        screen.queryByTestId("responsive-container")
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId("area-chart")).not.toBeInTheDocument();
    });
  });

  describe("quando há dados", () => {
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

    it("deve renderizar o gráfico quando há dados", () => {
      vi.mocked(useGraphicViewModel).mockReturnValue({
        chartData: [
          { name: "Seg", v: 1 },
          { name: "Ter", v: 0 },
          { name: "Qua", v: 0 },
          { name: "Qui", v: 0 },
          { name: "Sex", v: 0 },
          { name: "Sab", v: 0 },
          { name: "Dom", v: 0 },
        ],
        hasData: true,
        totalContent: 1,
      });

      render(<GraphicView contents={mockContents} />);

      expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
      expect(screen.getByTestId("area-chart")).toBeInTheDocument();
      expect(screen.getByTestId("area")).toBeInTheDocument();
      expect(screen.getByTestId("x-axis")).toBeInTheDocument();
      expect(screen.getByTestId("tooltip")).toBeInTheDocument();
    });

    it("não deve exibir mensagem de 'sem conteúdo' quando há dados", () => {
      vi.mocked(useGraphicViewModel).mockReturnValue({
        chartData: [{ name: "Seg", v: 1 }],
        hasData: true,
        totalContent: 1,
      });

      render(<GraphicView contents={mockContents} />);

      expect(
        screen.queryByText("Nenhum conteúdo gerado ainda")
      ).not.toBeInTheDocument();
    });

    it("deve chamar o viewmodel com os contents corretos", () => {
      vi.mocked(useGraphicViewModel).mockReturnValue({
        chartData: [],
        hasData: true,
        totalContent: 1,
      });

      render(<GraphicView contents={mockContents} />);

      expect(useGraphicViewModel).toHaveBeenCalledWith({
        contents: mockContents,
      });
    });
  });

  describe("renderização de estado vazio", () => {
    it("deve ter a estrutura correta para o estado vazio", () => {
      vi.mocked(useGraphicViewModel).mockReturnValue({
        chartData: [],
        hasData: false,
        totalContent: 0,
      });

      const { container } = render(<GraphicView contents={[]} />);

      const emptyStateDiv = container.querySelector(
        ".h-full.w-full.flex.items-center.justify-center"
      );
      expect(emptyStateDiv).toBeInTheDocument();
    });

    it("deve ter o texto com a classe correta no estado vazio", () => {
      vi.mocked(useGraphicViewModel).mockReturnValue({
        chartData: [],
        hasData: false,
        totalContent: 0,
      });

      render(<GraphicView contents={[]} />);

      const emptyText = screen.getByText("Nenhum conteúdo gerado ainda");
      expect(emptyText).toHaveClass("text-gray-500", "text-sm");
    });
  });
});
