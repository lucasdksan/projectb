export type FlowMode = "guided" | "free";

export type FlowStage =
    | "pick_mode"
    | "wait_image"
    | "guided"
    | "free_input"
    | "semi_free_notes"
    | "pick_output"
    | "idle_after_result";

export type QuickReply = {
    id: string;
    label: string;
};

export type ChatMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
    image?: string;
    quickReplies?: QuickReply[];
    /** Resultado: imagem em data URL (apenas assistant) */
    resultImage?: string;
    /** Resultado: texto markdown (prompt) */
    isPromptResult?: boolean;
    /** Mensagem temporária de carregamento (removida ao concluir) */
    isLoadingMarker?: boolean;
};

export type GuidedQuestion = {
    id: keyof GuidedAnswersState;
    text: string;
    options: QuickReply[];
};

export type GuidedAnswersState = {
    imageType: string;
    purpose: string;
    emotion: string;
    aestheticRef: string;
    aspectRatio: string;
    /** Ângulo da “câmera” em linguagem simples */
    shotAngle: string;
    /** Distância / enquadramento */
    shotDistance: string;
    /** Sensação de luz (sem jargão técnico) */
    lightingFeel: string;
};

export const GUIDED_QUESTIONS: GuidedQuestion[] = [
    {
        id: "imageType",
        text: "Qual o **tipo de imagem** você quer criar?",
        options: [
            { id: "portrait", label: "Retrato" },
            { id: "landscape", label: "Paisagem" },
            { id: "product", label: "Produto" },
            { id: "conceptual", label: "Conceitual" },
            { id: "other_type", label: "Outros" },
        ],
    },
    {
        id: "purpose",
        text: "Qual o **propósito** da imagem?",
        options: [
            { id: "social", label: "Redes sociais" },
            { id: "ads", label: "Publicidade" },
            { id: "editorial", label: "Editorial" },
            { id: "portfolio", label: "Portfólio" },
            { id: "other_purpose", label: "Outros" },
        ],
    },
    {
        id: "emotion",
        text: "Qual **emoção ou tom** visual você busca?",
        options: [
            { id: "dramatic", label: "Dramático" },
            { id: "mysterious", label: "Misterioso" },
            { id: "happy", label: "Alegre" },
            { id: "minimalist", label: "Minimalista" },
        ],
    },
    {
        id: "aestheticRef",
        text: "Quais **referências estéticas** combinam com você?",
        options: [
            { id: "cinema", label: "Cinema" },
            { id: "classic_photo", label: "Fotografia clássica" },
            { id: "trends", label: "Tendências" },
            { id: "no_ref", label: "Sem referência específica" },
        ],
    },
    {
        id: "aspectRatio",
        text: "Qual **formato / proporção** você prefere?",
        options: [
            { id: "1_1", label: "1:1 (quadrado — feed)" },
            { id: "9_16", label: "9:16 (stories / reels)" },
            { id: "16_9", label: "16:9 (horizontal)" },
        ],
    },
    {
        id: "shotAngle",
        text: "De qual **ângulo** você imagina a foto? *(Como se a câmera estivesse posicionada.)*",
        options: [
            { id: "front", label: "De frente (clássico)" },
            { id: "top", label: "De cima (vista de cima)" },
            { id: "side", label: "De lado (perfil)" },
            { id: "low", label: "De baixo (olhando para cima)" },
            { id: "three_quarter", label: "Três quartos (meio de lado)" },
        ],
    },
    {
        id: "shotDistance",
        text: "Quão **perto** ou **longe** você quer ver o produto ou a cena?",
        options: [
            { id: "macro", label: "Bem de perto (detalhe)" },
            { id: "close", label: "Perto (produto em destaque)" },
            { id: "medium", label: "Médio (produto + um pouco de contexto)" },
            { id: "wide", label: "Longe (cenário inteiro)" },
        ],
    },
    {
        id: "lightingFeel",
        text: "Que **sensação de luz** você prefere? *(Escolha o que mais combina — sem termos técnicos.)*",
        options: [
            { id: "natural", label: "Luz natural (dia / janela)" },
            { id: "studio", label: "Estúdio limpo e uniforme" },
            { id: "contrast", label: "Contraste forte (sombras marcadas)" },
            { id: "soft", label: "Suave e difusa (sem sombras duras)" },
            { id: "golden", label: "Luz quente (fim de tarde)" },
        ],
    },
];

export function createMessage(
    role: ChatMessage["role"],
    content: string,
    extras?: Partial<Omit<ChatMessage, "role" | "content">>
): ChatMessage {
    const { id, ...rest } = extras ?? {};
    return {
        id: id ?? crypto.randomUUID(),
        role,
        content,
        ...rest,
    };
}
