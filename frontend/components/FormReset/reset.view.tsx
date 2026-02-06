"use client";

import useResetViewModel from "./reset.viewmodel";

export default function ResetView() {
    const { form, submit, isSubmitting } = useResetViewModel();

    return (
        <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-400 ml-1">Nome Completo</label>
                <input
                    {...form.register("token")}
                    className="w-full bg-sidebar border border-white/10 rounded-2xl py-3.5 px-6 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder-gray-700"
                    required
                />
                {form.formState.errors.token && (
                    <p className="text-red-500 text-sm">{form.formState.errors.token.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-400 ml-1">E-mail</label>
                <input
                    {...form.register("email")}
                    type="email"
                    className="w-full bg-sidebar border border-white/10 rounded-2xl py-3.5 px-6 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder-gray-700"
                    required
                />
                {form.formState.errors.email && (
                    <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-400 ml-1">Senha</label>
                <input
                    {...form.register("password")}
                    type="password"
                    className="w-full bg-sidebar border border-white/10 rounded-2xl py-3.5 px-6 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder-gray-700"
                    required
                />
                {form.formState.errors.password && (
                    <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-400 ml-1">Confirmar Senha</label>
                <input
                    {...form.register("confirmPassword")}
                    type="password"
                    className="w-full bg-sidebar border border-white/10 rounded-2xl py-3.5 px-6 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder-gray-700"
                    required
                />
                {form.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{form.formState.errors.confirmPassword.message}</p>
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
    )
}