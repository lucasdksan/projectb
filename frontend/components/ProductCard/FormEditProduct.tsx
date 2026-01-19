"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addProductSchema, addProductSchemaType } from "../FormCreateProduct/schema";
import Button from "@/frontend/ui/button";
import Input from "@/frontend/ui/input";
import TextArea from "@/frontend/ui/textarea";
import { useToast } from "@/frontend/hooks/useToast";
import { getProductAction, updateProductAction } from "@/app/(private)/dashboard/product/[slug]/action";

interface FormEditProductProps {
    productId: number;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function FormEditProduct({ productId, onSuccess, onCancel }: FormEditProductProps) {
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<addProductSchemaType>({
        resolver: zodResolver(addProductSchema),
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "attributes"
    });

    useEffect(() => {
        async function loadProduct() {
            const result = await getProductAction(productId);
            if (result.success && result.product) {
                reset({
                    name: result.product.name,
                    description: result.product.description,
                    price: result.product.price,
                    stock: result.product.stock,
                    isActive: result.product.isActive,
                    category: result.product.category,
                    storeId: result.product.storeId,
                    attributes: result.product.attributes as any || [],
                });
            } else {
                showToast({
                    title: "Erro",
                    message: result.message || "Erro ao carregar produto",
                    type: "error",
                });
                onCancel();
            }
            setIsLoading(false);
        }
        loadProduct();
    }, [productId, reset, showToast, onCancel]);

    async function onSubmit(data: addProductSchemaType) {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value === undefined || value === null) return;
            
            if (key === "attributes") {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, String(value));
            }
        });

        const result = await updateProductAction(productId, formData);

        if (!result.success) {
            showToast({
                title: "Erro",
                message: result.message || "Erro ao atualizar produto",
                type: "error",
            });
            return;
        }

        showToast({
            title: "Sucesso",
            message: "Produto atualizado com sucesso",
            type: "success",
        });
        onSuccess();
    }

    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse p-2">
                <div className="h-10 bg-slate-100 rounded-lg w-full"></div>
                <div className="h-10 bg-slate-100 rounded-lg w-full"></div>
                <div className="h-32 bg-slate-100 rounded-lg w-full"></div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Input
                        inputKey="name"
                        label="Nome"
                        {...register("name")}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                    <Input
                        inputKey="category"
                        label="Categoria"
                        {...register("category")}
                    />
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Input
                        inputKey="price"
                        label="Preço"
                        type="number"
                        {...register("price", { valueAsNumber: true })}
                    />
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                </div>
                <div>
                    <Input
                        inputKey="stock"
                        label="Estoque"
                        type="number"
                        {...register("stock", { valueAsNumber: true })}
                    />
                    {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
                </div>
            </div>

            <div>
                <TextArea
                    inputKey="description"
                    label="Descrição"
                    rows={3}
                    {...register("description")}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="flex items-center gap-2 py-2">
                <input
                    type="checkbox"
                    id="isActive"
                    {...register("isActive")}
                    className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary cursor-pointer"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-slate-700 cursor-pointer">
                    Produto Ativo
                </label>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-2">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-slate-900">Atributos</h4>
                    <button
                        type="button"
                        onClick={() => append({ kindof: "", value: "" })}
                        className="text-primary text-xs font-bold hover:underline cursor-pointer"
                    >
                        + Adicionar
                    </button>
                </div>
                
                <div className="max-h-32 overflow-y-auto pr-2 space-y-2">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex flex-col gap-1">
                            <div className="flex gap-2 items-center">
                                <input
                                    placeholder="Tipo"
                                    {...register(`attributes.${index}.kindof` as const)}
                                    className={`text-xs rounded border ${errors.attributes?.[index]?.kindof ? 'border-red-500' : 'border-slate-200'} bg-slate-50 h-8 px-2 w-1/2 focus:outline-none focus:border-primary`}
                                />
                                <input
                                    placeholder="Valor"
                                    {...register(`attributes.${index}.value` as const)}
                                    className={`text-xs rounded border ${errors.attributes?.[index]?.value ? 'border-red-500' : 'border-slate-200'} bg-slate-50 h-8 px-2 w-1/2 focus:outline-none focus:border-primary`}
                                />
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="text-slate-400 hover:text-red-500 cursor-pointer p-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>
                            {(errors.attributes?.[index]?.kindof || errors.attributes?.[index]?.value) && (
                                <p className="text-[10px] text-red-500">Tipo e Valor são obrigatórios</p>
                            )}
                        </div>
                    ))}
                    {fields.length === 0 && (
                        <p className="text-xs text-slate-400 italic">Nenhum atributo adicionado.</p>
                    )}
                </div>
            </div>

            <div className="flex gap-3 mt-6">
                <Button
                    type="button"
                    label="Cancelar"
                    onClick={onCancel}
                    className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 h-11"
                />
                <Button
                    type="submit"
                    label={isSubmitting ? "Salvando..." : "Salvar Alterações"}
                    disabled={isSubmitting}
                    className="bg-primary text-slate-900 hover:bg-[#0fd60f] h-11"
                />
            </div>
        </form>
    );
}
