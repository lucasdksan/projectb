import { OrderService } from "../services/order.service";
import type { CreateOrderDTO } from "../schemas/order.schema";

export const OrderController = {
    async createOrder(dto: CreateOrderDTO) {
        return await OrderService.createOrder(dto);
    },
};
