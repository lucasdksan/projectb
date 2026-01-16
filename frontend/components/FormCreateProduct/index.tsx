"use client";

import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { addProductAction } from "@/app/(private)/dashboard/product/create/action";
import { addProductSchema, addProductSchemaType } from "./schema";
import Button from "@/frontend/ui/button";
import Input from "@/frontend/ui/input";
import TextArea from "@/frontend/ui/textarea";
import { useToast } from "@/frontend/hooks/useToast";


export default function FormCreateProduct({ storeId }: { storeId: number; }) {
    const { showToast } = useToast();
    const router = useRouter();
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<addProductSchemaType>({
        resolver: zodResolver(addProductSchema),
        defaultValues: {
            attributes: [],
        }
    });

    useEffect(() => {
        if (storeId) {
            reset({
                storeId
            });
        }
    }, [storeId, reset]);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "attributes"
    });

    async function onSubmit(data: addProductSchemaType) {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (typeof value === "object") {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, String(value));
            }
        });

        const result = await addProductAction(formData);

        if (!result?.success) {
            if(result.errors && Object.keys(result.errors).length > 0) {
                Object.entries(result.errors).forEach(([key, value]) => {
                    showToast({
                        title: "Erro",
                        message: value[0] ?? "Erro ao cadastrar produto",
                        type: "error",
                    });
                });
            } else {
                showToast({
                    title: "Erro",
                    message: result.message ?? "Erro ao cadastrar produto",
                    type: "error",
                });
            }

            return;
        }

        showToast({
            title: "Sucesso",
            message: result.message ?? "Produto cadastrado com sucesso",
            type: "success",
        });

        router.refresh();
        return;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full h-auto">
            <div className="lg:flex lg:justify-between">
                <p className="hidden lg:flex">Preencha as informações para cadastrar e gerar conteúdo.</p>
                <div className="flex gap-2.5 lg:w-80">
                    <Button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors" label="Cancelar" />
                    <Button type="submit" className="px-6 py-2 rounded-lg bg-primary hover:bg-[#0fd60f] text-[#102210] font-bold text-sm shadow-lg shadow-green-500/20 transition-all flex items-center gap-2" label="Salvar produto" />
                </div>
            </div>
            <div className="flex flex-col gap-6 lg:flex-row mt-6">
                <fieldset className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 w-full">
                    <div className="w-full flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">Informações Básicas</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-text-main text-base font-medium leading-normal">Ativar?</span>
                            <input type="checkbox" {...register("isActive")} defaultChecked={true} className="cursor-pointer" />
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-2 gap-2">
                        <div>
                            <Input inputKey="name" label="Nome" type="text" {...register("name")} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" />
                            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                        </div>
                        <div>
                            <Input inputKey="category" label="Categoria" type="text" {...register("category")} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" />
                            {errors.category && <p className="text-red-500">{errors.category.message}</p>}
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-2 gap-2 my-2">
                        <div>
                            <Input inputKey="price" label="Preço" type="number" {...register("price", { valueAsNumber: true })} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" />
                            {errors.price && <p className="text-red-500">{errors.price.message}</p>}
                        </div>
                        <div>
                            <Input inputKey="stock" label="Estoque" type="number" {...register("stock", { valueAsNumber: true })} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" />
                            {errors.stock && <p className="text-red-500">{errors.stock.message}</p>}
                        </div>
                    </div>
                    <TextArea inputKey="description" {...register("description")} label="Descrição" className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" rows={5} />
                </fieldset>
                <fieldset className="bg-white rounded-xl p-6 h-fit shadow-sm border border-slate-100 w-full lg:w-1/2">
                    <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">Atributos</h3>
                    <div className="flex flex-col gap-2 mb-6">
                        <div className="flex justify-between items-center">
                            <div className="w-1/3">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 block">Tipo</span>
                            </div>
                            <div className="flex-1">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 block">Valor</span>
                            </div>
                            <div className="w-1/5">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 block"></span>
                            </div>
                        </div>
                        {fields.map((field, index) => {
                            return (
                                <div key={field.id} className="flex gap-2 items-center w-full">
                                    <input
                                        placeholder="Tipo (ex: Tamanho)"
                                        {...register(`attributes.${index}.kindof`)}
                                        className="text-xs rounded border-slate-200 bg-slate-50 h-8 px-2 w-1/2"
                                    />

                                    <input
                                        placeholder="Valor (ex: M, G, GG)"
                                        {...register(`attributes.${index}.value`)}
                                        className="text-xs rounded border-slate-200 bg-slate-50 h-8 px-2 flex-1"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-slate-400 hover:text-red-500 w-1/5 cursor-pointer"
                                    >
                                        X
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <button
                        type="button"
                        onClick={() => append({ kindof: "", value: "" })}
                        className="w-full py-2 cursor-pointer border border-dashed border-slate-300 rounded-lg text-slate-500 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1 mt-2"
                    >
                        + Adicionar atributo
                    </button>
                </fieldset>
            </div>
        </form>
    );
}