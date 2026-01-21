"use client";

import { useState } from "react";
import WhiteCard from "../WhiteCard";
import Select from "@/frontend/ui/select";
import FileDropzone from "../FileDropzone";
import Button from "@/frontend/ui/button";
import { generateAIContentAction } from "@/app/(private)/dashboard/contentAI/action";
import { useToast } from "@/frontend/hooks/useToast";
import { parseAIJsonString } from "@/libs/parseAIJsonString";
import CopyCard from "./CopyCard";

export type jsonContentAIProps = {
    headline: string;
    description: string;
    cta: string;
    hashtags: string[];
}

export default function FormGenerateContentAI() {
    const { showToast } = useToast();
    const [json, setJson] = useState<jsonContentAIProps | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [platform, setPlatform] = useState<string>("instagram");

    async function handleSubmit(formData: FormData) {
        if (!file) {
            showToast({
                title: "Atenção",
                message: "Por favor, selecione uma imagem",
                type: "error",
            });
            return;
        }

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

        setJson(jsonResult);

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
                        <h3 className="text-sm font-bold">Coloque a imagem para geração do conteúdo</h3>

                        <Select
                            onChange={(e) => setPlatform(e.target.value)}
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
                    />

                    <input type="hidden" name="platform" value={platform} />

                    <Button type="submit" label="Gerar conteúdo" />
                </WhiteCard>
            </form>
            <div className="lg:col-span-7 flex flex-col gap-4">
                {json && (
                    <>
                        <CopyCard rows={1} activeBold title="Título / Headline" value={json.headline} />
                        <CopyCard rows={7} activeBold={false} title="Legenda / Descrição" value={json.description} />
                        <div className="flex flex-row gap-2">
                            <CopyCard rows={5} activeBold={false} title="Call to Action (CTA)" value={json.cta} />
                            <CopyCard rows={5} activeBold={false} title="Hashtags" value={json.hashtags.join(", ")} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
