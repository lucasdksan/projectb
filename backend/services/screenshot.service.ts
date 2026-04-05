import { chromium } from "playwright";

const ALLOWED_SOCIAL_DOMAINS = [
    "instagram.com",
    "www.instagram.com",
    "tiktok.com",
    "www.tiktok.com",
    "linkedin.com",
    "www.linkedin.com",
    "twitter.com",
    "www.twitter.com",
    "x.com",
    "www.x.com",
    "facebook.com",
    "www.facebook.com",
    "fb.com",
    "youtube.com",
    "www.youtube.com",
    "pinterest.com",
    "www.pinterest.com",
] as const;

const URL_REGEX =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi;

const HANDLE_REGEX = /@([a-zA-Z0-9._]+)/g;

function isSocialMediaUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        const host = parsed.hostname.toLowerCase();
        return ALLOWED_SOCIAL_DOMAINS.some(
            (domain) => host === domain || host.endsWith(`.${domain}`)
        );
    } catch {
        return false;
    }
}

function extractUrlsFromText(text: string): string[] {
    const urls: string[] = [];
    const urlMatches = text.matchAll(URL_REGEX);
    for (const m of urlMatches) {
        const url = m[0];
        if (isSocialMediaUrl(url)) urls.push(url);
    }
    return [...new Set(urls)];
}

function extractHandlesFromText(text: string): string[] {
    const handles: string[] = [];
    const matches = text.matchAll(HANDLE_REGEX);
    for (const m of matches) {
        const handle = m[1];
        if (handle && handle.length >= 2 && handle.length <= 30) handles.push(handle);
    }
    return [...new Set(handles)];
}

function handleToInstagramUrl(handle: string): string {
    return `https://www.instagram.com/${handle}`;
}

export function getValidSocialUrls(text: string): string[] {
    const urls = extractUrlsFromText(text);
    const handles = extractHandlesFromText(text);
    const instagramUrls = handles.map(handleToInstagramUrl);
    return [...new Set([...urls, ...instagramUrls])];
}

export type ScreenshotResult =
    | { success: true; blob: Blob }
    | { success: false; error: string };

const SCREENSHOT_TIMEOUT_MS = 15_000;
const VIEWPORT = { width: 1280, height: 720 };

export async function captureSocialScreenshot(url: string): Promise<ScreenshotResult> {
    if (!isSocialMediaUrl(url)) {
        return {
            success: false,
            error: "Apenas links de redes sociais são permitidos (Instagram, TikTok, LinkedIn, X, Facebook, YouTube, Pinterest).",
        };
    }

    let browser;
    try {
        browser = await chromium.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const context = await browser.newContext({
            viewport: VIEWPORT,
            userAgent:
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            ignoreHTTPSErrors: true,
        });

        const page = await context.newPage();
        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: SCREENSHOT_TIMEOUT_MS,
        });

        await new Promise((r) => setTimeout(r, 2000));

        const buffer = await page.screenshot({
            type: "png",
            fullPage: false,
        });

        await browser.close();

        const blob = new Blob([new Uint8Array(buffer)], { type: "image/png" });
        return { success: true, blob };
    } catch (error) {
        if (browser) await browser.close().catch(() => {});
        const message = error instanceof Error ? error.message : "Erro ao capturar screenshot";
        return { success: false, error: message };
    }
}

export async function captureFirstValidScreenshot(text: string): Promise<Blob | null> {
    const urls = getValidSocialUrls(text);
    if (urls.length === 0) return null;

    for (const url of urls) {
        const result = await captureSocialScreenshot(url);
        
        if (result.success) return result.blob;
    }
    return null;
}
