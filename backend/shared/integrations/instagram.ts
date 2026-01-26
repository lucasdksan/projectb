import { env } from "@/libs/env";
import { Errors } from "../errors/errors";
import { InstagramIntegration } from "./intefaces";

export const instagramIntegration: InstagramIntegration = {
  async publishToInstagram(url: string, caption: string, IG_ID: string): Promise<{ success: boolean, message: string }> {
    const ACCESS_TOKEN = env.INSTAGRAM_TOKEN;
    const containerRes = await fetch(
      `https://graph.instagram.com/v24.0/${IG_ID}/media`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: url,
          caption,
        })
      }
    );
    const container = await containerRes.json();

    if(!container.id) {
      return {
        success: false,
        message: "Erro ao gerar o container no Instagram",
      }
    }

    await new Promise(resolve => setTimeout(resolve, 15000));

    const publishRes = await fetch(
      `https://graph.instagram.com/v24.0/${IG_ID}/media_publish`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creation_id: container.id,
        }),
      }
    );

    const publish = await publishRes.json();

    if(!publish.id) {
      return {
        success: false,
        message: "Erro ao publicar no Instagram",
      }
    }

    return {
      success: true,
      message: "Publicação realizada",
    };
  }
};