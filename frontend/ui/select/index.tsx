import { SelectHTMLAttributes } from "react";

interface Option {
    valueOption: string;
    titleOption: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    options: Option[];
}

function Select({ options, className, ...props }: SelectProps) {
    const textClass = className ? `${className}` : "";

    return (
        <select
            className={`text-base font-medium leading-normal tracking-[0.015em] transition-all flex w-full cursor-pointer items-center justify-between rounded-lg h-12 px-4 ${textClass}`}
            {...props}
        >
            {options.map(({ valueOption, titleOption }) => (
                <option key={valueOption} value={valueOption}>
                    {titleOption}
                </option>
            ))}
        </select>
    );
}

export default Select;
