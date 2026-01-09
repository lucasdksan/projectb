import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Button from "../index"

describe("Button", () => {
    it("renderiza o label corretamente", () => {
        render(<Button label="Comprar" />)

        expect(screen.getByText("Comprar")).toBeInTheDocument()
    })

    it("renderiza um elemento button", () => {
        render(<Button label="Enviar" />)

        const button = screen.getByRole("button", { name: "Enviar" })
        expect(button).toBeInTheDocument()
    })

    it("passa props nativas do button corretamente", () => {
        render(<Button label="Salvar" disabled />)

        const button = screen.getByRole("button", { name: "Salvar" })
        expect(button).toBeDisabled()
    })

    it("dispara o evento onClick", async () => {
        const onClick = vi.fn()

        render(<Button label="Clique aqui" onClick={onClick} />)

        const button = screen.getByRole("button", { name: "Clique aqui" })
        await button.click()

        expect(onClick).toHaveBeenCalledTimes(1)
    })
})
