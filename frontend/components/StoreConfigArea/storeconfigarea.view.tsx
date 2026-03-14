"use client";

import { CameraIcon, ImageIcon } from "lucide-react";
import { ACCEPTED_IMAGE_EXT, StoreConfigAreaProps } from "./storeconfigarea.model";
import { useStoreConfigAreaViewModel } from "./storeconfigarea.viewmodel";

export default function StoreConfigAreaView({ config }: StoreConfigAreaProps) {
    const {
        form,
        updateField,
        logoPreview,
        bannerHeroPreview,
        bannerHeroMobilePreview,
        bannerSecondaryPreview,
        bannerTertiaryPreview,
        handleLogoChange,
        handleBannerHeroChange,
        handleBannerHeroMobileChange,
        handleBannerSecondaryChange,
        handleBannerTertiaryChange,
        removeBannerHero,
        removeBannerHeroMobile,
        removeBannerSecondary,
        removeBannerTertiary,
        logoInputRef,
        bannerHeroInputRef,
        bannerHeroMobileInputRef,
        bannerSecondaryInputRef,
        bannerTertiaryInputRef,
        isLoading,
        handleSubmit,
    } = useStoreConfigAreaViewModel(config);

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <section className="bg-[#161616] border border-white/5 p-8 rounded-3xl space-y-6">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Logo da Loja</h3>
                <div className="relative group aspect-[3/1] bg-[#0d0d0d] rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center">
                    {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="max-h-full object-contain p-4" />
                    ) : (
                        <div className="text-gray-600 flex flex-col items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            <span className="text-xs font-bold">Upload Logo</span>
                        </div>
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <input
                            ref={logoInputRef}
                            type="file"
                            className="hidden"
                            accept={ACCEPTED_IMAGE_EXT}
                            onChange={handleLogoChange}
                            disabled={isLoading}
                        />
                        <span className="text-white font-bold flex items-center gap-2">
                            <CameraIcon className="w-4 h-4" /> Alterar Logo
                        </span>
                    </label>
                </div>
            </section>

            <section className="bg-[#161616] border border-white/5 p-8 rounded-3xl space-y-8">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Cores da Identidade</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Cor Primária</label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={form.primaryColor}
                                onChange={(e) => updateField("primaryColor", e.target.value)}
                                disabled={isLoading}
                                className="flex-1 bg-[#0d0d0d] border border-white/10 rounded-xl py-3 px-4 text-white font-mono focus:outline-none focus:border-[#00ff41]/50 transition-all"
                            />
                            <input
                                type="color"
                                value={form.primaryColor}
                                onChange={(e) => updateField("primaryColor", e.target.value)}
                                disabled={isLoading}
                                className="w-14 h-14 rounded-xl cursor-pointer bg-transparent border-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Cor Secundária</label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={form.secondaryColor}
                                onChange={(e) => updateField("secondaryColor", e.target.value)}
                                disabled={isLoading}
                                className="flex-1 bg-[#0d0d0d] border border-white/10 rounded-xl py-3 px-4 text-white font-mono focus:outline-none focus:border-[#00ff41]/50 transition-all"
                            />
                            <input
                                type="color"
                                value={form.secondaryColor}
                                onChange={(e) => updateField("secondaryColor", e.target.value)}
                                disabled={isLoading}
                                className="w-14 h-14 rounded-xl cursor-pointer bg-transparent border-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                    <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">Pré-visualização</h4>
                    <div className="flex gap-4">
                        <div
                            className="w-16 h-16 rounded-2xl shadow-lg"
                            style={{ backgroundColor: form.primaryColor }}
                        />
                        <div
                            className="w-16 h-16 rounded-2xl shadow-lg"
                            style={{ backgroundColor: form.secondaryColor }}
                        />
                    </div>
                </div>
            </section>

            <section className="bg-[#161616] border border-white/5 p-8 rounded-3xl space-y-8">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Banners Publicitários</h3>
                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Banner Hero (Desktop)</label>
                            {bannerHeroPreview && (
                                <button
                                    type="button"
                                    onClick={removeBannerHero}
                                    disabled={isLoading}
                                    className="text-xs text-red-400 hover:text-red-300 font-bold transition-colors"
                                >
                                    Remover
                                </button>
                            )}
                        </div>
                        <div className="relative group aspect-[3/1] bg-[#0d0d0d] rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center">
                            {bannerHeroPreview ? (
                                <img src={bannerHeroPreview} alt="Hero Desktop" className="w-full h-full object-cover opacity-60" />
                            ) : (
                                <div className="text-gray-600 flex flex-col items-center gap-2">
                                    <ImageIcon className="w-4 h-4" />
                                    <span className="text-xs font-bold">Sem banner</span>
                                </div>
                            )}
                            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <input
                                    ref={bannerHeroInputRef}
                                    type="file"
                                    className="hidden"
                                    accept={ACCEPTED_IMAGE_EXT}
                                    onChange={handleBannerHeroChange}
                                    disabled={isLoading}
                                />
                                <span className="text-white font-bold flex items-center gap-2">
                                    <CameraIcon className="w-4 h-4" /> Alterar Banner
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Banner Hero (Mobile)</label>
                                {bannerHeroMobilePreview && (
                                    <button
                                        type="button"
                                        onClick={removeBannerHeroMobile}
                                        disabled={isLoading}
                                        className="text-xs text-red-400 hover:text-red-300 font-bold transition-colors"
                                    >
                                        Remover
                                    </button>
                                )}
                            </div>
                            <div className="relative group aspect-[3/4] bg-[#0d0d0d] rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center">
                                {bannerHeroMobilePreview ? (
                                    <img src={bannerHeroMobilePreview} alt="Hero Mobile" className="w-full h-full object-cover opacity-60" />
                                ) : (
                                    <div className="text-gray-600 flex flex-col items-center gap-2">
                                        <ImageIcon className="w-4 h-4" />
                                        <span className="text-xs font-bold">Sem banner</span>
                                    </div>
                                )}
                                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <input
                                        ref={bannerHeroMobileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept={ACCEPTED_IMAGE_EXT}
                                        onChange={handleBannerHeroMobileChange}
                                        disabled={isLoading}
                                    />
                                    <span className="text-white font-bold flex items-center gap-2">
                                        <CameraIcon className="w-4 h-4" /> Alterar Banner
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Banner Secundário</label>
                                    {bannerSecondaryPreview && (
                                        <button
                                            type="button"
                                            onClick={removeBannerSecondary}
                                            disabled={isLoading}
                                            className="text-xs text-red-400 hover:text-red-300 font-bold transition-colors"
                                        >
                                            Remover
                                        </button>
                                    )}
                                </div>
                                <div className="relative group aspect-[2/1] bg-[#0d0d0d] rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center">
                                    {bannerSecondaryPreview ? (
                                        <img src={bannerSecondaryPreview} alt="Banner Secundário" className="w-full h-full object-cover opacity-60" />
                                    ) : (
                                        <div className="text-gray-600 flex flex-col items-center gap-2">
                                            <ImageIcon className="w-4 h-4" />
                                            <span className="text-xs font-bold">Sem banner</span>
                                        </div>
                                    )}
                                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <input
                                            ref={bannerSecondaryInputRef}
                                            type="file"
                                            className="hidden"
                                            accept={ACCEPTED_IMAGE_EXT}
                                            onChange={handleBannerSecondaryChange}
                                            disabled={isLoading}
                                        />
                                        <span className="text-white font-bold flex items-center gap-2">
                                            <CameraIcon className="w-4 h-4" /> Alterar Banner
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Banner Terciário</label>
                                    {bannerTertiaryPreview && (
                                        <button
                                            type="button"
                                            onClick={removeBannerTertiary}
                                            disabled={isLoading}
                                            className="text-xs text-red-400 hover:text-red-300 font-bold transition-colors"
                                        >
                                            Remover
                                        </button>
                                    )}
                                </div>
                                <div className="relative group aspect-[2/1] bg-[#0d0d0d] rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center">
                                    {bannerTertiaryPreview ? (
                                        <img src={bannerTertiaryPreview} alt="Banner Terciário" className="w-full h-full object-cover opacity-60" />
                                    ) : (
                                        <div className="text-gray-600 flex flex-col items-center gap-2">
                                            <ImageIcon className="w-4 h-4" />
                                            <span className="text-xs font-bold">Sem banner</span>
                                        </div>
                                    )}
                                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <input
                                            ref={bannerTertiaryInputRef}
                                            type="file"
                                            className="hidden"
                                            accept={ACCEPTED_IMAGE_EXT}
                                            onChange={handleBannerTertiaryChange}
                                            disabled={isLoading}
                                        />
                                        <span className="text-white font-bold flex items-center gap-2">
                                            <CameraIcon className="w-4 h-4" /> Alterar Banner
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/20 py-4 rounded-2xl font-bold hover:bg-[#00ff41]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Salvando..." : "Salvar Configurações"}
                </button>
            </section>
        </form>
    );
}
