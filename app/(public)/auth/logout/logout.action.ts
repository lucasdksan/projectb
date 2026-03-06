"use server";

import tokenIntoCookies from "@/libs/token";

export async function logoutAction(_formData: FormData) {
    await tokenIntoCookies.deleteAll();
}