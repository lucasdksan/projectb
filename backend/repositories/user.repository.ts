import { UpdateUserDTO } from "../schemas/user.schema";
import { prisma } from "../database/prisma";

export const UserRepository = {
    async updateUser(data: UpdateUserDTO, userId: number){
        return await prisma.users.update({
            where: { id: userId },
            data
        });
    }
}