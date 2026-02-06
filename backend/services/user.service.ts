import jwt from "@/libs/jwt";
import { UserRepository } from "../repositories/user.repository";
import { UpdateUserDTO } from "../schemas/user.schema";

export const UserService = {
    async updateUser(data: UpdateUserDTO, userId: number){
        const user = await UserRepository.updateUser(data, userId);

        const tokenAccess = jwt.signJwt({
            sub: user.id,
            name: user.name,
            email: user.email,
        });

        return {
            token: tokenAccess,
            name: user.name,
        }
    }
}