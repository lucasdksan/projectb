import { prisma } from "@/backend/shared/database/prisma";
import { createUser, updateUser } from "./auth.types";

export const AuthRepository = {
    async create(data: createUser){
        const user = await prisma.users.create({
            data: {
                email: data.email,
                name: data.name,
                password: data.password,
            }
        });

        return user;
    },

    async findByEmail(email: string){
        return await prisma.users.findFirst({
            where: { email },
        });
    },

    async update(data: updateUser, userId: number){
        return await prisma.users.update({
            where: { id: userId },
            data
        });
    }
};