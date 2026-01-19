import { ButtonHTMLAttributes } from "react";

interface CardIAProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    title: string;
    btnText: string;
    colorIcon: string;
}

export default function CardIA({ text, title, btnText, colorIcon, ...props }: CardIAProps) {
    return (
        <button className="cursor-pointer group relative flex flex-col items-start w-full p-4 rounded-xl border border-[#e5e8e5] hover:border-primary/50 bg-[#fbfcfb] hover:bg-white transition-all shadow-sm hover:shadow-md text-left" {...props}>
            <div className="flex w-full items-start gap-3">
                <div className={`shrink-0 size-10 rounded-lg ${colorIcon} text-white flex items-center justify-center`}>

                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">{title}</h4>
                    <p className="text-xs text-text-secondary mt-1">{text}</p>
                </div>
            </div>
            <div className="w-full mt-4 h-9 flex items-center justify-center rounded-lg bg-white border border-[#e5e8e5] text-sm font-bold text-text-main group-hover:bg-primary group-hover:text-text-main group-hover:border-primary transition-colors">
                {btnText}
            </div>
        </button>
    );
}