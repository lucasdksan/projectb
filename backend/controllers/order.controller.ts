import { OrderService } from "../services/order.service";
import type { CreateOrderDTO } from "../schemas/order.schema";

export const OrderController = {
    async createOrder(dto: CreateOrderDTO) {
        return await OrderService.createOrder(dto);
    },

    async getSalesData(storeId: number) {
        const [orderCount, totalRevenue] = await Promise.all([
            OrderService.quantityOrders(storeId),
            OrderService.totalRevenue(storeId),
        ]);
        return { orderCount, totalRevenue };
    },
};
