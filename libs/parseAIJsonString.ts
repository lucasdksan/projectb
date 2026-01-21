export function parseAIJsonString(input: string) {
    if (!input) return null;

    let cleaned = input.trim();
    
    cleaned = cleaned.replace(/```json/i, '').replace(/```/g, '').trim();
    cleaned = cleaned.replace(/^json\s*/i, '').trim();

    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) return null;

    const jsonText = match[0];

    try {
        return JSON.parse(jsonText);
    } catch (err) {
        console.error("Erro ao fazer JSON.parse:", err);
        return null;
    }
}
