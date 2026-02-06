import { UserService } from "../services/user.service";
import { UpdateUserDTO } from "../schemas/user.schema";

export const UserController = {
    async updateUser(dto: UpdateUserDTO, userId: number){
        return await UserService.updateUser(dto, userId);
    }
}