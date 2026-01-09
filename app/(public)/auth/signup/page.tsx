import Link from "next/link";
import FormSignUp from "@/frontend/components/FormSignUp";

export default function SignUpPage() {
  return (
    <>
      <div className="pt-10 pb-2 px-8 flex flex-col items-center text-center">
        <h2 className="text-text-main text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
          Cadastre-se gratuitamente!
        </h2>
        <p className="text-text-secondary text-base font-normal leading-normal px-4">Cadastre-se gratuitamente para gerenciar seus produtos e vendas com IA</p>
      </div>
      <FormSignUp />
      <div className="text-center pt-2 pb-10">
        <p className="text-text-main text-sm">
          Já tem uma conta?
          <Link href="/auth/signin" className="ml-1 font-bold text-text-main underline decoration-[color:var(--color-primary)] decoration-2 underline-offset-4 hover:text-[color:var(--color-primary)] cursor-pointer transition-colors">
            Faça login
          </Link>
        </p>
      </div>
    </>
  );
}
