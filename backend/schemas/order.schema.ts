import { z } from "zod";

export const createOrderCustomerSchema = z.object({
    fullName: z.string().min(1, "Nome completo é obrigatório"),
    email: z.string().email("E-mail inválido"),
    cep: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
});

export const createOrderItemSchema = z.object({
    productId: z.number().int().min(1, "ID do produto é obrigatório"),
    quantity: z.number().int().min(1, "Quantidade deve ser pelo menos 1"),
});

export const createOrderSchema = z.object({
    storeSlug: z.string().min(1, "Slug da loja é obrigatório"),
    customer: createOrderCustomerSchema,
    items: z
        .array(createOrderItemSchema)
        .min(1, "É necessário pelo menos um item no pedido"),
});

export type CreateOrderDTO = z.infer<typeof createOrderSchema>;
export type CreateOrderCustomerDTO = z.infer<typeof createOrderCustomerSchema>;
export type CreateOrderItemDTO = z.infer<typeof createOrderItemSchema>;
