import Link from "next/link";
import FormSignIn from "@/frontend/components/FormSignIn";

export default function SignInPage() {
  return (
    <>
        <div className="pt-10 pb-2 px-8 flex flex-col items-center text-center">
            <h2 className="text-text-main text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                Bem vido
            </h2>
            <p className="text-text-secondary text-base font-normal leading-normal px-4">Gerencie seus produtos e vendas com IA</p>
        </div>
        <FormSignIn />
        <div className="text-center pt-2 pb-10">
            <p className="text-text-main text-sm">
                Não tem uma conta?
                <Link href="/auth/signup" className="ml-1 font-bold text-text-main underline decoration-[color:var(--color-primary)] decoration-2 underline-offset-4 hover:text-[color:var(--color-primary)] cursor-pointer transition-colors">
                    Criar conta
                </Link>
            </p>
        </div>
    </>
  );
}
