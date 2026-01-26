"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import WhiteCard from "../WhiteCard";
import Select from "@/frontend/ui/select";
import FileDropzone from "../FileDropzone";
import Button from "@/frontend/ui/button";
import { generateAIContentAction } from "@/app/(private)/dashboard/contentAI/action";
import { useToast } from "@/frontend/hooks/useToast";
import { parseAIJsonString } from "@/libs/parseAIJsonString";
import validateDataAiResponse from "./validateDataAiResponse";
import CopyCard from "./CopyCard";
import CopyBtn from "./CopyBtn";
import SalveContentAI from "./SalveContentAI";
import PostInstagramBtn from "./PostInstagramBtn";

export type jsonContentAIProps = {
    headline: string;
    description: string;
    cta: string;
    hashtags: string[];
}

export default function FormGenerateContentAI({ storeId }: { storeId: number }) {
    const { showToast } = useToast();
    const [json, setJson] = useState<jsonContentAIProps | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [platform, setPlatform] = useState<string>("instagram");
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        if (!file) {
            showToast({
                title: "Atenção",
                message: "Por favor, selecione uma imagem",
                type: "error",
            });
            return;
        }        

        setJson(null);
        formData.set("file", file);

        const result = await generateAIContentAction(formData);

        if (!result.success) {
            showToast({
                title: "Erro",
                message: result.message,
                type: "error",
            });
            return;
        }

        const jsonResult = parseAIJsonString(result.data ?? "{}") as jsonContentAIProps;
        const validatedJson = validateDataAiResponse(jsonResult);

        setJson(validatedJson);

        showToast({
            title: "Sucesso",
            message: result.message,
            type: "success",
        });
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-4">
            <form
                action={handleSubmit}
                className="lg:col-span-5 flex flex-col gap-4"
            >
                <WhiteCard>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                        <h3 className="text-sm font-bold mb-3 lg:mb-0">Coloque a imagem para geração do conteúdo</h3>

                        <Select
                            onChange={(e) => setPlatform(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors"
                            options={[
                                { valueOption: "instagram", titleOption: "Instagram" },
                                { valueOption: "whatsapp", titleOption: "WhatsApp" },
                                { valueOption: "shopee", titleOption: "Shopee" },
                            ]}
                        />
                    </div>

                    <FileDropzone
                        onFilesChange={(files) => {
                            setFile(files[0]);
                        }}
                        multiple={false}
                    />

                    <input type="hidden" name="platform" value={platform} />

                    <Button className="bg-primary hover:bg-[#0fdc0f] text-[#111811] mt-3"  type="submit" label="Gerar conteúdo" />
                </WhiteCard>
            </form>
            <div className="lg:col-span-7 flex flex-col gap-4">
                {json && (
                    <>
                        <CopyCard rows={2} activeBold title="Título / Headline" value={json.headline} />
                        <CopyCard rows={7} activeBold={false} title="Legenda / Descrição" value={json.description} />
                        <div className="flex flex-col lg:flex-row gap-2">
                            <CopyCard rows={5} activeBold={false} title="Call to Action (CTA)" value={json.cta} />
                            <CopyCard rows={5} activeBold={false} title="Hashtags" value={json.hashtags.join(" ")} />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 pt-2">
                            <CopyBtn 
                                headline={json.headline}
                                description={json.description}
                                cta={json.cta}
                                hashtags={json.hashtags}
                                platform={platform}
                            />
                            <SalveContentAI
                                headline={json.headline}
                                description={json.description}
                                cta={json.cta}
                                hashtags={json.hashtags}
                                platform={platform}
                                storeId={storeId}
                            />
                            {file && <PostInstagramBtn file={file} caption={
                                platform === "instagram" ? `${json.headline}\n\n${json.description}\n\n${json.cta}\n\n${json.hashtags.join(" ")}` : `${json.headline}\n${json.description}\n${json.cta}\n${json.hashtags.join(" ")}`
                            } storeId={storeId} />}
                        </div>
                    </>
                )}
                {!json && (
                    <WhiteCard>
                        <div className="flex flex-col gap-4">
                            <h3 className="text-sm font-bold">Nenhum conteúdo gerado</h3>
                            <p className="text-sm text-text-secondary">Por favor, selecione uma imagem para gerar o conteúdo</p>
                            <Button type="button" onClick={() => router.back()} className="px-4 py-2 rounded-lg border border-slate-400 text-slate-400 font-medium bg-white text-sm hover:bg-slate-50 transition-colors" label="Cancelar" />
                        </div>
                    </WhiteCard>
                )}
            </div>
        </div>
    );
}
