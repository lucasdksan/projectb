const MAX_IMAGE_BYTES = 6 * 1024 * 1024;

function isLoopbackOrPrivateHostname(hostname: string): boolean {
    const h = hostname.toLowerCase();
    if (h === "localhost" || h.endsWith(".localhost")) return true;

    const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(h);
    if (!m) return false;
    const [a, b] = [Number(m[1]), Number(m[2])];
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && Number(m[2]) === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    return false;
}

/** Hostnames allowed for server-side image fetch (Vercel Blob public URLs). */
function isTrustedImageHost(hostname: string): boolean {
    const h = hostname.toLowerCase();
    return h.endsWith(".public.blob.vercel-storage.com");
}

export function assertTrustedProductImageUrl(urlString: string): URL {
    let u: URL;
    try {
        u = new URL(urlString);
    } catch {
        throw new Error("URL da imagem inválida.");
    }
    if (u.protocol !== "https:") {
        throw new Error("Apenas URLs HTTPS são permitidas para imagens da loja.");
    }
    const host = u.hostname;
    if (isLoopbackOrPrivateHostname(host)) {
        throw new Error("Host da imagem não permitido.");
    }
    if (!isTrustedImageHost(host)) {
        throw new Error(
            "Use o upload de ficheiro ou uma imagem já alojada na loja (armazenamento Vercel Blob)."
        );
    }
    return u;
}

export async function fetchTrustedProductImageBlob(urlString: string): Promise<Blob> {
    const u = assertTrustedProductImageUrl(urlString);
    const response = await fetch(u.toString(), {
        redirect: "manual",
        headers: { Accept: "image/*,*/*;q=0.8" },
    });

    if (response.status >= 300 && response.status < 400) {
        throw new Error("Redirecionamentos não são permitidos ao carregar a imagem.");
    }
    if (!response.ok) {
        throw new Error("Não foi possível carregar a imagem do produto.");
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
        throw new Error("A URL não retornou uma imagem.");
    }

    const blob = await response.blob();
    if (blob.size > MAX_IMAGE_BYTES) {
        throw new Error(`A imagem deve ter no máximo ${MAX_IMAGE_BYTES / (1024 * 1024)}MB.`);
    }
    return blob;
}
