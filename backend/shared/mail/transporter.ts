import { env } from "@/libs/env";
import nodemailer from "nodemailer";
import { sendEmailSchema, sendEmailSchemaType } from "./schema";
import { Errors } from "../errors/errors";

const transporter = nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: Number(env.MAIL_PORT),
    secure: false,
    auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS,
    },
});

export default async function sendEmail(dataEmail: sendEmailSchemaType){
    const validatedData = sendEmailSchema.safeParse(dataEmail);

    if(!validatedData.success) {
        throw Errors.validation("Invalid data", validatedData.error.message);
    }
    
    const mail = await transporter.sendMail({
        ...validatedData.data
    });

    return mail;
}