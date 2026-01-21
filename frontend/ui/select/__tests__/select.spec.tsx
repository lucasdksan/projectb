import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Select from "../index";

describe("Select", () => {
    it("renderiza um elemento select", () => {
        render(<Select options={[]} />);

        const select = screen.getByRole("combobox");
        expect(select).toBeInTheDocument();
    });

    it("renderiza options corretamente", () => {
        render(
            <Select
                options={[
                    { valueOption: "a", titleOption: "Item A" },
                    { valueOption: "b", titleOption: "Item B" },
                ]}
            />
        );

        expect(screen.getByText("Item A")).toBeInTheDocument();
        expect(screen.getByText("Item B")).toBeInTheDocument();
    });

    it("passa props nativos corretamente", () => {
        render(
            <Select
                disabled
                options={[{ valueOption: "1", titleOption: "Teste" }]}
            />
        );

        const select = screen.getByRole("combobox");
        expect(select).toBeDisabled();
    });

    it("dispara onChange", () => {
        const onChange = vi.fn();

        render(
            <Select
                onChange={onChange}
                options={[
                    { valueOption: "x", titleOption: "X" },
                    { valueOption: "y", titleOption: "Y" },
                ]}
            />
        );

        const select = screen.getByRole("combobox");

        fireEvent.change(select, { target: { value: "y" } });

        expect(onChange).toHaveBeenCalledTimes(1);
    });
});
