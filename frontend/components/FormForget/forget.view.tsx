"use client";

import useForgetViewModel from "./forget.viewmodel";

export default function ForgetView() {
    const { form, submit, isSubmitting } = useForgetViewModel();

    return (
        <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
            {form.formState.errors.root && (
                <p className="text-red-500 text-sm bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                    {form.formState.errors.root.message}
                </p>
            )}
            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-400 ml-1">E-mail de cadastro</label>
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

            <button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-accent text-black py-4 rounded-2xl font-bold text-lg hover:bg-[#00e03a] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/10 mt-4"
            >
                Enviar link
            </button>
        </form>
    )
}