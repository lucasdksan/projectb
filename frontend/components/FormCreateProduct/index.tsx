"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addProductAction } from "@/app/(private)/dashboard/product/create/action";
import { addProductSchema, addProductSchemaType } from "./schema";
import Button from "@/frontend/ui/button";
import Input from "@/frontend/ui/input";
import TextArea from "@/frontend/ui/textarea";

export default function FormCreateProduct({ storeId }: { storeId: number; }) {
    const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
    // const router = useRouter();
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
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
        console.log(data);
       
        // const formData = new FormData();

        // Object.entries(data).forEach(([key, value]) => {
        //     formData.append(key, String(value));
        // });

        // const result = await addProductAction(formData);

        // if (!result?.success) {
        //     setServerErrors(result?.errors ?? {});
        //     return;
        // }

        // router.push("/auth/add/reset");
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
            <div>
                <fieldset>
                    <legend className="font-semibold">Informações Básicas</legend>
                    <div className="w-full">
                        <Input inputKey="name" label="Nome" type="text" {...register("name")} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" />
                        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                    </div>
                    <div className="w-full">
                        <div>
                            <Input inputKey="category" label="Categoria" type="text" {...register("category")} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" />
                            {errors.category && <p className="text-red-500">{errors.category.message}</p>}
                        </div>
                        <div>
                            <Input inputKey="price" label="Preço" type="number" {...register("price", { valueAsNumber: true })} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" />
                            {errors.price && <p className="text-red-500">{errors.price.message}</p>}
                        </div>
                    </div>
                    <div className="w-full">
                        <div>
                            <Input inputKey="stock" label="Estoque" type="number" {...register("stock", { valueAsNumber: true })} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" />
                            {errors.stock && <p className="text-red-500">{errors.stock.message}</p>}
                        </div>
                        <div>
                            <Input inputKey="isActive" label="Ativo" type="checkbox" {...register("isActive")} className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" />
                            {errors.isActive && <p className="text-red-500">{errors.isActive.message}</p>}
                        </div>
                    </div>
                    <TextArea inputKey="description" label="Descrição" className="placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--color-primary)] focus:outline-none" rows={10} />
                </fieldset>
                <fieldset>
                    <legend className="font-semibold">Atributos</legend>
                    <div>
                        <div>
                            <span>Tipo</span>
                            <span>Valor</span>
                        </div>
                        {fields.map((field, index) => {
                            return (
                                <div key={field.id} className="flex gap-2 items-start">
                                    <input
                                        placeholder="Tipo (ex: Tamanho)"
                                        {...register(`attributes.${index}.type`)}
                                        className="border p-2 rounded w-40"
                                    />

                                    <input
                                        placeholder="Valor (ex: M, G, GG)"
                                        {...register(`attributes.${index}.value`)}
                                        className="border p-2 rounded flex-1"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-red-500 font-medium"
                                    >
                                        X
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <button
                        type="button"
                        onClick={() => append({ type: "", value: "" })}
                        className="text-blue-600 text-sm mt-2"
                    >
                        + Adicionar atributo
                    </button>
                </fieldset>
            </div>
        </form>
    );
}