import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
}

function Button({ label, type = "button", ...props }: ButtonProps){
    const { className, ...rest } = props as Record<string, any>;
    const textClass = className ? `${className}` : "";

    return(
        <button type={type} className={`text-base font-bold leading-normal tracking-[0.015em] transition-allflex w-full cursor-pointer items-center justify-center rounded-lg h-12 px-4  ${textClass}`} {...rest}>{label}{props.children}</button>
    );
}

export default Button;