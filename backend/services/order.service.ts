import { StoreService } from "./store.service";
import { ProductsRepository } from "../repositories/products.repository";
import { CustomerRepository } from "../repositories/customer.repository";
import { OrderRepository } from "../repositories/order.repository";
import type { CreateOrderDTO } from "../schemas/order.schema";

export const OrderService = {
    async createOrder(dto: CreateOrderDTO) {
        const store = await StoreService.getStoreBySlug(dto.storeSlug);
        if (!store) return { success: false, error: "Loja não encontrada" };

        const productIds = dto.items.map((i) => i.productId);
        const products = await ProductsRepository.findManyByIds(productIds);

        const validProducts = products.filter((p) => p.storeId === store.id);
        if (validProducts.length !== productIds.length) {
            return { success: false, error: "Um ou mais produtos não pertencem a esta loja" };
        }

        for (const item of dto.items) {
            const product = validProducts.find((p) => p.id === item.productId);
            if (!product || product.stock < item.quantity) {
                return {
                    success: false,
                    error: `Estoque insuficiente para ${product?.name ?? "produto"}`,
                };
            }
        }

        const customer = await CustomerRepository.create(store.id, dto.customer);

        let subtotal = 0;
        const orderItems: { productId: number; quantity: number; unitPrice: number }[] = [];

        for (const item of dto.items) {
            const product = validProducts.find((p) => p.id === item.productId)!;
            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;
            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: product.price,
            });
        }

        const shipping = 0;
        const total = subtotal + shipping;

        const order = await OrderRepository.createOrder({
            storeId: store.id,
            customerId: customer.id,
            subtotal,
            shipping,
            total,
            items: orderItems,
        });

        return { success: true, orderId: order.id };
    },

    async quantityOrders(storeId: number) {
        return await OrderRepository.countByStoreId(storeId);
    },

    async totalRevenue(storeId: number) {
        return await OrderRepository.totalRevenueByStoreId(storeId);
    },

    async getSalesData(storeId: number) {
        const [orderCount, totalRevenue] = await Promise.all([
            OrderRepository.countByStoreId(storeId),
            OrderRepository.totalRevenueByStoreId(storeId),
        ]);
        return { orderCount, totalRevenue };
    },
};
