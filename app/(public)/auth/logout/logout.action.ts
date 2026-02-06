"use server";

import tokenIntoCookies from "@/libs/token";

export async function logoutAction(formData: FormData) {
    await tokenIntoCookies.delete("token");

    return;
}