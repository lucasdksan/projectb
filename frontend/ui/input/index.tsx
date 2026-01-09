import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    leftLabel?: {
        label: string;
        link: string;
        classStyle: string;
    };
    inputKey: string;
}

function Input({ label, inputKey, leftLabel, ...props }: InputProps){
    const { className, ...rest } = props as Record<string, any>;
    const textClass = className ? `${className}` : "";

    return(
        <fieldset className="flex flex-col gap-2 border-none">
            <div className="flex flex-row justify-between items-center">
                <label className="text-text-main text-base font-medium leading-normal" htmlFor={inputKey}>{label}</label>
                { leftLabel && (
                    <a href={leftLabel.link} className={leftLabel.classStyle}>{leftLabel.label}</a>
                ) }
            </div>
            <input {...rest} className={`w-full p-4 rounded-lg text-text-main border border-border-light bg-white h-14 text-base font-normal leading-normal ${textClass}`} id={inputKey} />
        </fieldset>
    );
}

export default Input;