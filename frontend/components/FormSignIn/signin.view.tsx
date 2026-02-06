"use client";

import Link from "next/link";
import { useSigninViewModel } from "./signin.viewmodel";

export default function SigninView() {
    const { form, submit, isSubmitting } = useSigninViewModel();

    return (
        <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
            <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-semibold text-gray-400 ml-1">E-mail</label>
                <input
                    {...form.register("email")}
                    id="email"
                    type="email"
                    className="w-full bg-sidebar border border-white/10 rounded-2xl py-3.5 px-6 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder-gray-700"
                    required
                />
                {form.formState.errors.email && (
                    <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <div className="flex justify-between items-center ml-1">
                    <label htmlFor="password" className="text-sm font-semibold text-gray-400">Senha</label>
                    <Link href="/auth/forget" className="text-xs font-bold text-accent hover:underline">Esqueceu?</Link>
                </div>
                <input
                    {...form.register("password")}
                    id="password"
                    type="password"
                    className="w-full bg-sidebar border border-white/10 rounded-2xl py-3.5 px-6 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder-gray-700"
                    required
                />
                {form.formState.errors.password && (
                    <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
                )}
            </div>

            <button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-accent text-black py-4 rounded-2xl font-bold text-lg hover:bg-[#00e03a] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/10 mt-6"
            >
                Cadastrar
            </button>
        </form>
    );
}