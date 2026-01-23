import { jsonContentAIProps } from ".";

export default function validateDataAiResponse(data: jsonContentAIProps): jsonContentAIProps {
    if (!data) {
        return {
            headline: "",
            description: "",
            cta: "",
            hashtags: []
        };
    }

    const hashtags = Array.isArray(data.hashtags) 
        ? data.hashtags
            .map(hashtag => {
                if (!hashtag || typeof hashtag !== 'string') return "";
                
                let cleaned = hashtag.trim().replace(/\s+/g, '');
                if (cleaned.length === 0) return "";
                
                return cleaned.startsWith("#") ? cleaned : `#${cleaned}`;
            })
            .filter(hashtag => hashtag.length > 0)
        : [];

    return {
        headline: (data.headline || "").trim(),
        description: (data.description || "").trim(),
        cta: (data.cta || "").trim(),
        hashtags,
    };
}