import { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    inputKey: string;
}

function TextArea({ label, inputKey, ...props }: TextAreaProps){
    const { className, ...rest } = props as Record<string, any>;
    const textClass = className ? `${className}` : "";

    return(
        <fieldset className="flex flex-col gap-2 border-none">
            <div className="flex flex-row justify-between items-center">
                <label className="text-text-main text-base font-medium leading-normal" htmlFor={inputKey}>{label}</label>
            </div>
            <textarea {...rest} className={`w-full p-4 rounded-lg text-text-main border border-border-light bg-white text-base font-normal leading-normal ${textClass}`} id={inputKey} />
        </fieldset>
    );
}

export default TextArea;