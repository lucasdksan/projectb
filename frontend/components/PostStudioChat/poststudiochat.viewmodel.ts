"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import {
    createMessage,
    type ChatMessage,
    type FlowMode,
    type FlowStage,
    type GuidedAnswersState,
    GUIDED_QUESTIONS,
} from "./poststudiochat.model";
import {
    postStudioChatGenerateAction,
    type PostStudioChatActionResult,
} from "@/app/(private)/dashboard/postStudio/poststudiochat.action";

function welcomeMessage(): ChatMessage {
    return createMessage(
        "assistant",
        "Bem-vindo ao **Post Studio Chat**. Escolha como prefere trabalhar:\n\n• **Modo Guiado** — responda a perguntas rápidas para refinar o resultado.\n• **Modo Livre** — descreva sua ideia em texto.\n\nEm ambos os casos você precisará enviar uma **imagem base** (produto ou referência).",
        {
            quickReplies: [
                { id: "mode:guided", label: "Modo Guiado" },
                { id: "mode:free", label: "Modo Livre" },
            ],
        },
    );
}

function semiFreeInstructionsMessage(): ChatMessage {
    return createMessage(
        "assistant",
        "Quer **complementar** com instruções extras? *(opcional)*\n\nEx.: trocar manequins por pessoas reais, mudar cores, incluir texto na arte, remover ou trocar o fundo…\n\nDigite abaixo ou toque em **Continuar sem extras**.",
        {
            quickReplies: [{ id: "semi:skip", label: "Continuar sem extras" }],
        },
    );
}

function pickOutputMessage(): ChatMessage {
    return createMessage(
        "assistant",
        "Quase lá! Você prefere **gerar um prompt detalhado** (para usar em outra IA) ou **gerar a imagem final** aqui?",
        {
            quickReplies: [
                { id: "out:prompt", label: "Gerar Prompt detalhado" },
                { id: "out:image", label: "Gerar Imagem final" },
            ],
        },
    );
}

export function usePostStudioChatViewModel() {
    const [messages, setMessages] = useState<ChatMessage[]>(() => [welcomeMessage()]);
    const [stage, setStage] = useState<FlowStage>("pick_mode");
    const [flowMode, setFlowMode] = useState<FlowMode | null>(null);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [guidedAnswers, setGuidedAnswers] = useState<Partial<GuidedAnswersState>>({});
    const [freeText, setFreeText] = useState("");
    const [extraNotes, setExtraNotes] = useState("");
    const [input, setInput] = useState("");
    const [baseImageFile, setBaseImageFile] = useState<File | null>(null);
    const [baseImagePreview, setBaseImagePreview] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToEnd = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToEnd();
    }, [messages, scrollToEnd]);

    const clearQuickReplies = useCallback((messageId: string) => {
        setMessages((prev) =>
            prev.map((m) => (m.id === messageId ? { ...m, quickReplies: undefined } : m)),
        );
    }, []);

    const resetConversation = useCallback(() => {
        setMessages([welcomeMessage()]);
        setStage("pick_mode");
        setFlowMode(null);
        setQuestionIndex(0);
        setGuidedAnswers({});
        setFreeText("");
        setExtraNotes("");
        setInput("");
        setBaseImageFile(null);
        setBaseImagePreview(null);
        setActionError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, []);

    const pushAssistantQuestion = useCallback((index: number) => {
        const q = GUIDED_QUESTIONS[index];
        if (!q) return;
        setMessages((prev) => [
            ...prev,
            createMessage("assistant", q.text, {
                quickReplies: q.options.map((o) => ({
                    id: `${q.id}:${o.id}`,
                    label: o.label,
                })),
            }),
        ]);
    }, []);

    const runGeneration = useCallback(
        (outputType: "prompt" | "image") => {
            if (!baseImageFile || !flowMode) {
                setActionError("Imagem ou modo ausente. Reinicie o fluxo.");
                return;
            }

            if (flowMode === "guided") {
                const g = guidedAnswers as GuidedAnswersState;
                const keys: (keyof GuidedAnswersState)[] = [
                    "imageType",
                    "purpose",
                    "emotion",
                    "aestheticRef",
                    "aspectRatio",
                    "shotAngle",
                    "shotDistance",
                    "lightingFeel",
                ];
                if (!keys.every((k) => Boolean(g[k]?.trim()))) {
                    setActionError("Respostas incompletas.");
                    return;
                }
            } else {
                if (!freeText.trim()) {
                    setActionError("Descrição livre ausente.");
                    return;
                }
            }

            setActionError(null);
            const loadingId = crypto.randomUUID();
            setMessages((prev) => [
                ...prev,
                createMessage(
                    "assistant",
                    outputType === "prompt"
                        ? "Gerando seu **prompt** profissional…"
                        : "Gerando sua **imagem**… Isso pode levar um instante.",
                    { id: loadingId, isLoadingMarker: true },
                ),
            ]);

            startTransition(async () => {
                const fd = new FormData();
                fd.set("image", baseImageFile);
                fd.set("mode", flowMode);
                fd.set("outputType", outputType);
                if (flowMode === "guided") {
                    fd.set("guidedAnswers", JSON.stringify(guidedAnswers));
                } else {
                    fd.set("freeText", freeText.trim());
                }
                const notes = extraNotes.trim();
                if (notes) {
                    fd.set("extraNotes", notes);
                }

                const result: PostStudioChatActionResult = await postStudioChatGenerateAction(null, fd);

                setMessages((prev) => {
                    const withoutLoading = prev.filter((m) => !m.isLoadingMarker);
                    if (!result.success) {
                        const err =
                            result.errors?.global?.[0] ||
                            Object.values(result.errors || {})
                                .flat()
                                .filter(Boolean)[0] ||
                            "Erro ao gerar.";
                        return [
                            ...withoutLoading,
                            createMessage("assistant", `**Erro:** ${err}`),
                        ];
                    }

                    if (result.kind === "prompt") {
                        return [
                            ...withoutLoading,
                            createMessage("assistant", result.data, { isPromptResult: true }),
                        ];
                    }

                    return [
                        ...withoutLoading,
                        createMessage("assistant", "Aqui está sua imagem:", {
                            resultImage: result.data,
                        }),
                    ];
                });

                if (result.success) {
                    setStage("idle_after_result");
                } else {
                    const err =
                        result.errors?.global?.[0] ||
                        Object.values(result.errors || {})
                            .flat()
                            .filter(Boolean)[0] ||
                        "Erro ao gerar.";
                    setActionError(err);
                }
            });
        },
        [baseImageFile, flowMode, freeText, guidedAnswers, extraNotes],
    );

    const handleQuickReply = useCallback(
        (messageId: string, replyId: string) => {
            clearQuickReplies(messageId);

            if (replyId.startsWith("mode:")) {
                const mode = replyId === "mode:guided" ? "guided" : "free";
                setFlowMode(mode);
                setStage("wait_image");
                setMessages((prev) => [
                    ...prev,
                    createMessage("user", mode === "guided" ? "Modo Guiado" : "Modo Livre"),
                    createMessage(
                        "assistant",
                        "Envie a **imagem base** (produto ou referência). Toque no clipe, escolha o arquivo e pressione enviar.",
                    ),
                ]);
                return;
            }

            if (replyId.startsWith("out:")) {
                const kind = replyId === "out:prompt" ? "prompt" : "image";
                setMessages((prev) => [
                    ...prev,
                    createMessage(
                        "user",
                        kind === "prompt" ? "Quero gerar um prompt detalhado" : "Quero gerar a imagem final",
                    ),
                ]);
                runGeneration(kind);
                return;
            }

            if (replyId === "semi:skip") {
                setExtraNotes("");
                setStage("pick_output");
                setMessages((prev) => [
                    ...prev,
                    createMessage("user", "Continuar sem extras"),
                    pickOutputMessage(),
                ]);
                return;
            }

            const colon = replyId.indexOf(":");
            if (colon === -1) return;
            const field = replyId.slice(0, colon) as keyof GuidedAnswersState;
            const optId = replyId.slice(colon + 1);
            const q = GUIDED_QUESTIONS.find((x) => x.id === field);
            const opt = q?.options.find((o) => o.id === optId);
            if (!q || !opt) return;

            setGuidedAnswers((prev) => ({ ...prev, [field]: opt.label }));
            setMessages((prev) => [...prev, createMessage("user", opt.label)]);

            const nextIndex = questionIndex + 1;
            if (nextIndex < GUIDED_QUESTIONS.length) {
                setQuestionIndex(nextIndex);
                pushAssistantQuestion(nextIndex);
            } else {
                setStage("semi_free_notes");
                setMessages((prev) => [...prev, semiFreeInstructionsMessage()]);
            }
        },
        [clearQuickReplies, questionIndex, pushAssistantQuestion, runGeneration],
    );

    const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setBaseImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setBaseImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    }, []);

    const handleSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (isPending) return;

            if (stage === "wait_image") {
                if (!baseImageFile || !baseImagePreview) {
                    setActionError("Selecione uma imagem antes de continuar.");
                    return;
                }
                setActionError(null);
                setMessages((prev) => [
                    ...prev,
                    createMessage("user", input.trim() || "Imagem enviada", { image: baseImagePreview }),
                    createMessage(
                        "assistant",
                        flowMode === "guided"
                            ? "Perfeito! Vamos refinar com algumas perguntas rápidas."
                            : "Ótimo! Agora descreva com o máximo de detalhes a **ideia** da imagem que você quer (cenário, luz, texto na arte, público, etc.).",
                    ),
                ]);

                if (flowMode === "guided") {
                    setQuestionIndex(0);
                    setStage("guided");
                    pushAssistantQuestion(0);
                } else {
                    setStage("free_input");
                }
                setInput("");
                return;
            }

            if (stage === "free_input") {
                const text = input.trim();
                if (!text) {
                    setActionError("Digite sua ideia para continuar.");
                    return;
                }
                setActionError(null);
                setFreeText(text);
                setMessages((prev) => [...prev, createMessage("user", text), semiFreeInstructionsMessage()]);
                setStage("semi_free_notes");
                setInput("");
                return;
            }

            if (stage === "semi_free_notes") {
                const notes = input.trim();
                if (!notes) {
                    setActionError("Digite suas instruções extras ou use “Continuar sem extras”.");
                    return;
                }
                setActionError(null);
                setExtraNotes(notes);
                setMessages((prev) => [
                    ...prev,
                    createMessage("user", notes),
                    pickOutputMessage(),
                ]);
                setStage("pick_output");
                setInput("");
            }
        },
        [
            stage,
            isPending,
            baseImageFile,
            baseImagePreview,
            input,
            flowMode,
            pushAssistantQuestion,
        ],
    );

    const inputPlaceholder =
        stage === "wait_image"
            ? baseImageFile
                ? "Opcional: uma nota sobre a imagem…"
                : "Selecione uma imagem com o clipe acima"
            : stage === "free_input"
              ? "Descreva a ideia da imagem (cenário, estilo, texto, público-alvo…)"
              : stage === "semi_free_notes"
                ? "Instruções extras (ex.: trocar manequins por pessoas reais…)"
              : stage === "idle_after_result"
                ? "Use “Nova conversa” para recomeçar"
                : "Aguarde a próxima etapa…";

    const canUseTextInput =
        stage === "wait_image" || stage === "free_input" || stage === "semi_free_notes";

    const submitDisabled =
        isPending ||
        (stage === "wait_image" && !baseImageFile) ||
        (stage === "free_input" && !input.trim()) ||
        (stage === "semi_free_notes" && !input.trim()) ||
        stage === "pick_mode" ||
        stage === "guided" ||
        stage === "pick_output" ||
        stage === "idle_after_result";

    return {
        messages,
        input,
        setInput,
        stage,
        baseImagePreview,
        actionError,
        isLoading: isPending,
        messagesEndRef,
        fileInputRef,
        handleImageChange,
        handleSubmit,
        handleQuickReply,
        resetConversation,
        inputPlaceholder,
        canUseTextInput,
        submitDisabled,
        showAttach: stage === "wait_image",
    };
}
