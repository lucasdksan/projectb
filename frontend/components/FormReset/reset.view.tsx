"use client";

import useResetViewModel from "./reset.viewmodel";

export default function ResetView() {
    const { form, submit, isSubmitting } = useResetViewModel();

    return (
        <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
            {form.formState.errors.root && (
                <p className="text-red-500 text-sm bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                    {form.formState.errors.root.message}
                </p>
            )}
            <div className="space-y-1">
                <label htmlFor="token" className="text-sm font-semibold text-gray-400 ml-1">Token</label>
                <input
                    {...form.register("token")}
                    id="token"
                    placeholder="Cole o token recebido por e-mail"
                    className="w-full bg-sidebar border border-white/10 rounded-2xl py-3.5 px-6 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder-gray-700"
                    required
                />
                {form.formState.errors.token && (
                    <p className="text-red-500 text-sm">{form.formState.errors.token.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-semibold text-gray-400 ml-1">E-mail</label>
                <input
                    {...form.register("email")}
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="w-full bg-sidebar border border-white/10 rounded-2xl py-3.5 px-6 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder-gray-700"
                    required
                />
                {form.formState.errors.email && (
                    <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label htmlFor="password" className="text-sm font-semibold text-gray-400 ml-1">Nova senha</label>
                <input
                    {...form.register("password")}
                    id="password"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    className="w-full bg-sidebar border border-white/10 rounded-2xl py-3.5 px-6 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder-gray-700"
                    required
                />
                {form.formState.errors.password && (
                    <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-400 ml-1">Confirmar senha</label>
                <input
                    {...form.register("confirmPassword")}
                    id="confirmPassword"
                    type="password"
                    placeholder="Repita a nova senha"
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
                Redefinir senha
            </button>
        </form>
    )
}