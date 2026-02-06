import { Errors } from "../errors/errors";
import { AuthRepository } from "../repositories/auth.repository";
import { CreateUserDTO, ResetUserDTO, SignInDTO } from "../schemas/auth.schema";
import jwt from "@/libs/jwt";
import crypt from "@/libs/crypt";
import { forget } from "@/libs/forget";
import sendEmail from "./mail.service";

export const AuthService = {
    async createUser(data: CreateUserDTO) {
        const existingUser = await AuthRepository.exist(data.email);

        if (existingUser) {
            throw Errors.unauthorized("User already exists");
        }

        const hashedPassword = await crypt.hashPassword(data.password);
        const { id, name, email } = await AuthRepository.createUser({
            name: data.name,
            email: data.email,
            password: hashedPassword,
        });
        const token = jwt.signJwt({
            sub: id,
            name: name,
            email: email,
        });

        return { token, name, email };
    },

    async signIn(dto: SignInDTO){
        const user = await AuthRepository.findUserByEmail(dto.email);

        if(!user) {
            throw Errors.unauthorized("User not found");
        }

        const isPasswordValid = await crypt.comparePassword(dto.password, user.password);

        if(!isPasswordValid) {
            throw Errors.unauthorized("Invalid password");
        }

        const token = jwt.signJwt({
            sub: user.id,
            name: user.name,
            email: user.email,
        });

        return {
            token,
            name: user.name,
            email: user.email,
        };
    },

    async forgot(email: string) {
        const user = await AuthRepository.findUserByEmail(email);

        if(!user) {
            throw Errors.unauthorized("User not found");
        }

        const { now, token } = forget.generateDateAndToken();
        const newUser = await AuthRepository.updateUser({
            passwordResetExpires: now,
            passwordResetToken: token,
        }, user.id);

        await sendEmail({
            from: "projectb@gmail.com",
            html: `
                Utilize esse token para modificar sua senha ${token}
            `,
            subject: "Token para alterar senha",
            text: "",
            to: newUser.email
        });

        return {
            status: true,
        }
    },

    async reset(dto: ResetUserDTO) {
        const user = await AuthRepository.findUserByEmail(dto.email);

        if(!user) {
            throw Errors.unauthorized("User not found");
        }

        const { passwordResetToken, passwordResetExpires } = user;
        const { message, success } = forget.validateToken({ passwordResetToken, passwordResetExpires, token: dto.token }); 

        if(message && !success) throw Errors.validation(message);

        const hashedPassword = await crypt.hashPassword(dto.password);        
        const userUpdatedWithNewPass= await AuthRepository.updateUser({
            passwordResetToken: "",
            password: hashedPassword,
        }, user.id);
        const tokenAccess = jwt.signJwt({
            sub: userUpdatedWithNewPass.id,
            name: userUpdatedWithNewPass.name,
            email: userUpdatedWithNewPass.email,
        });

        return {
            status: true,
            token: tokenAccess
        }
    }
}