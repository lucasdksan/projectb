import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TextArea from "..";

describe("TextArea component", () => {

  it("renderiza o label corretamente", () => {
    render(<TextArea label="Descrição" inputKey="desc" />);

    const label = screen.getByText("Descrição");
    expect(label).toBeDefined();
    expect(label.getAttribute("for")).toBe("desc");
  });

  it("renderiza o textarea com id correto", () => {
    render(<TextArea label="Descrição" inputKey="desc" />);
    const textarea = screen.getByRole("textbox");

    expect(textarea).toBeDefined();
    expect(textarea.id).toBe("desc");
  });

  it("propaga props para o textarea", () => {
    render(<TextArea label="Mensagem" inputKey="msg" placeholder="Digite algo..." />);
    
    const textarea = screen.getByPlaceholderText("Digite algo...");
    expect(textarea).toBeDefined();
  });

  it("chama onChange ao digitar", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <TextArea 
        label="Mensagem" 
        inputKey="msg" 
        onChange={handleChange}
      />
    );

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Oi!");

    expect(handleChange).toHaveBeenCalledTimes(3); // 3 caracteres
  });

  it("adiciona className customizado ao textarea", () => {
    render(
      <TextArea
        label="Mensagem"
        inputKey="msg"
        className="bg-red-500"
      />
    );

    const textarea = screen.getByRole("textbox");
    expect(textarea.classList.contains("bg-red-500")).toBe(true);
  });
});
