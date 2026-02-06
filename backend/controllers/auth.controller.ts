import { CreateUserDTO, ForgetDTO, ResetUserDTO, SignInDTO } from "../schemas/auth.schema";
import { AuthService } from "../services/auth.service";

export const AuthController = {
    async createUser(dto: CreateUserDTO) {
        return await AuthService.createUser(dto);
    },

    async signIn(dto: SignInDTO) {
        return await AuthService.signIn(dto);
    },

    async forget(dto: ForgetDTO) {
        return await AuthService.forgot(dto.email!);
    },

    async reset(dto: ResetUserDTO) {
        return await AuthService.reset(dto);
    }
}