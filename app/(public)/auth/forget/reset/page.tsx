import FormReset from "@/frontend/components/FormReset";

export default function ResetPage(){
    return (
        <>
            <div className="pt-10 pb-2 px-8 flex flex-col items-center text-center">
                <h2 className="text-text-main text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                    Recuperar conta
                </h2>
                <p className="text-text-secondary text-base font-normal leading-normal px-4">Gerencie seus produtos e vendas com IA</p>
                <FormReset />
            </div>
        </>
    );
}