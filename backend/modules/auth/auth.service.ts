import { Errors } from "@/backend/shared/errors/errors";
import { createUser, createUserSchema, resetUser, resetUserSchema, signIn, signInSchema } from "./auth.types";
import { AuthRepository } from "./auth.repository";
import { comparePassword, hashPassword } from "@/backend/shared/database/password";
import { signJwt } from "@/libs/jwt";
import sendEmail from "@/backend/shared/mail/transporter";
import { forget } from "@/libs/forget";

export const AuthService = {
    async create(data: createUser){
        const validatedData = createUserSchema.safeParse(data);

        if(!validatedData.success) throw Errors.unauthorized("Dados inválidos");

        const { name, email, password } = validatedData.data;
        const findUser = await AuthRepository.findByEmail(email);

        if(!findUser) throw Errors.unauthorized("Usuário existente");

        const hashedPassword = await hashPassword(password);
        const user =  await AuthRepository.create({ name, email, password: hashedPassword });
        const token = signJwt({
            sub: user.id,
            name: user.name,
            email: user.email,
        });

        return {
            token,
            email,
            name 
        }
    },

    async signIn(data: signIn){ 
        const validatedData = signInSchema.safeParse(data);

        if(!validatedData.success) throw Errors.validation("Invalid data", validatedData.error.message);

        const { email, password } = validatedData.data;
        const user = await AuthRepository.findByEmail(email);

        if(!user) throw Errors.unauthorized("Invalid credentials");

        const passwordMatch = await comparePassword(password, user.password);

        if(!passwordMatch) throw Errors.unauthorized("Invalid credentials");

        const token = signJwt({
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

    async forgot(email: string){
        const user = await AuthRepository.findByEmail(email);

        if(!user) throw Errors.notFound("Usuário não encontrado.");

        const { now, token } = forget.generateDateAndToken();
        const newUser = await AuthRepository.update({
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

    async reset(data: resetUser){
        const validatedData = resetUserSchema.safeParse(data);

        if(!validatedData.success) throw Errors.validation("Invalid data", validatedData.error.message);

        const { email, password: newPass, token } = validatedData.data;
        const user = await AuthRepository.findByEmail(email);

        if(!user) throw Errors.notFound("Usuário não encontrado");

        const { passwordResetToken, passwordResetExpires } = user;
        const { message, success } = forget.validateToken({ passwordResetToken, passwordResetExpires, token }); 

        if(message && !success) throw Errors.validation(message);

        const hashedPassword = await hashPassword(newPass);        
        const userUpdatedWithNewPass= await AuthRepository.update({
            passwordResetToken: "",
            password: hashedPassword,
        }, user.id);

        const tokenAccess = signJwt({
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