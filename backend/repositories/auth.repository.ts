import { prisma } from "../database/prisma";
import { CreateUserDTO, CreateUserResponse, UpdateUserDTO } from "../schemas/auth.schema";

export const AuthRepository = {
    async createUser(data: CreateUserDTO): Promise<CreateUserResponse> {
        const user = await prisma.users.create({
            data: data,
        });

        return {
            id: user.id,
            name: user.name,
            email: user.email
        }
    },

    async findUserByEmail(email: string) {
        const user = await prisma.users.findFirst({
            where: {
                email: email,
            },
        });

        return user;
    },

    async exist(email: string): Promise<boolean> {
        const user = await prisma.users.findFirst({
            where: {
                email: email,
            },
        });

        return user ? true : false;
    },

    async updateUser(data: UpdateUserDTO, userId: number){
        return await prisma.users.update({
            where: { id: userId },
            data
        });
    }
}