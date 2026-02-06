import z from "zod";

export const createUserSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(8),
});

export const updateUserSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.email().optional(),
    password: z.string().min(8).optional(),
    passwordResetExpires: z.date().optional(),
    passwordResetToken: z.string().optional(),
});

export const signInSchema = z.object({
    email: z.email(),
    password: z.string(),
});

export const resetUserSchema = z.object({
    email: z.email(),
    token: z.string(),
    password: z.string().min(8),
});

export const forgetSchema = z.object({
    email: z.email(),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type CreateUserResponse = { id: number } & Omit<CreateUserDTO, "password" | "passwordResetToken" | "passwordResetExpires">;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type SignInDTO = z.infer<typeof signInSchema>;
export type ResetUserDTO = z.infer<typeof resetUserSchema>;
export type ForgetDTO = z.infer<typeof forgetSchema>;