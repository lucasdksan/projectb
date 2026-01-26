import { env } from "@/libs/env";
import { Errors } from "../errors/errors";

export const instagramIntegration = {
  async publishToInstagram(url: string, caption: string, IG_ID: string): Promise<any> {
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
      throw Errors.internal("Erro ao publicar");
    }

    return {
      success: true,
      message: "Publicação realizada",
    };
  }
};