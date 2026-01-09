import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Input from "../index";

describe("Input component", () => {
    it("renders the label correctly", () => {
        render(
            <Input
                inputKey="email"
                label="Seu e-mail"
                placeholder="exemplo@email.com"
            />
        );

        expect(screen.getByText("Seu e-mail")).toBeInTheDocument();
    });

    it("renders the input with correct placeholder", () => {
        render(
            <Input
                inputKey="email"
                label="Seu e-mail"
                placeholder="exemplo@email.com"
            />
        );

        const input = screen.getByPlaceholderText("exemplo@email.com");
        expect(input).toBeInTheDocument();
    });

    it("associates label with input using htmlFor", () => {
        render(
            <Input
                inputKey="email"
                label="Seu e-mail"
                placeholder="exemplo@email.com"
            />
        );

        const input = screen.getByLabelText("Seu e-mail");
        expect(input).toHaveAttribute("id", "email");
    });

    it("applies custom className to input", () => {
        render(
            <Input
                inputKey="email"
                label="Seu e-mail"
                className="placeholder:text-[color:var(--text-muted)]"
            />
        );

        const input = screen.getByLabelText("Seu e-mail");
        expect(input.className).toContain("placeholder:text-[color:var(--text-muted)]");
    });

    it("applies focus styles when focused", () => {
        render(
            <Input
                inputKey="email"
                label="Seu e-mail"
                className="focus:border-[color:var(--color-primary)]"
            />
        );

        const input = screen.getByLabelText("Seu e-mail");

        fireEvent.focus(input);

        expect(input.className).toContain("focus:border-[color:var(--color-primary)]");
    });

    it("renders leftLabel when provided", () => {
        render(
            <Input
                inputKey="email"
                label="Seu e-mail"
                leftLabel={{
                    label: "Esqueci minha senha",
                    link: "/forgot-password",
                    classStyle: "text-sm text-blue-500",
                }}
            />
        );

        const link = screen.getByText("Esqueci minha senha");

        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/forgot-password");
    });

    it("does not render leftLabel when not provided", () => {
        render(
            <Input
                inputKey="email"
                label="Seu e-mail"
            />
        );

        expect(
            screen.queryByText("Esqueci minha senha")
        ).not.toBeInTheDocument();
    });
});
