import { prisma } from "../database/prisma";

export const CustomerRepository = {
    async create(storeId: number, data: { fullName: string; email: string; cep?: string; city?: string; address?: string }) {
        return await prisma.customer.create({
            data: {
                storeId,
                fullName: data.fullName,
                email: data.email,
                cep: data.cep,
                city: data.city,
                address: data.address,
            },
        });
    },
};
