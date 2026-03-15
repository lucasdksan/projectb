import { prisma } from "../database/prisma";

export const OrderRepository = {
    async createOrder(data: {
        storeId: number;
        customerId: number;
        subtotal: number;
        shipping: number;
        total: number;
        items: { productId: number; quantity: number; unitPrice: number }[];
    }) {
        return await prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    storeId: data.storeId,
                    customerId: data.customerId,
                    status: "confirmed",
                    subtotal: data.subtotal,
                    shipping: data.shipping,
                    total: data.total,
                },
            });

            await tx.orderItem.createMany({
                data: data.items.map((item) => ({
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                })),
            });

            return order;
        });
    },
};
