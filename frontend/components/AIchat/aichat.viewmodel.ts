"use client";

import { useTransition, useEffect, useRef, useState } from "react";
import {
    sendMessageWithContextAction,
    type SendMessageActionResult,
} from "@/app/(private)/dashboard/contentAI/aichat.action";
import { saveContentAction } from "@/app/(private)/dashboard/contentAI/aicontent.action";
import { ChatMessage } from "./aichat.model";
import type { AIContentResponse, Platform } from "@/backend/schemas/aichat.schema";

function createMessage(
    role: ChatMessage["role"], 
    content: string, 
    image?: string,
    structuredContent?: AIContentResponse
): ChatMessage {
    return { 
        id: crypto.randomUUID(), 
        role, 
        content, 
        ...(image && { image }),
        ...(structuredContent && { structuredContent }),
    };
}

function convertToHistoryFormat(messages: ChatMessage[]) {
    return messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        content: msg.content,
    }));
}

export function useAichatViewModel() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedPlatform, setSelectedPlatform] = useState<Platform>("instagram");
    const [actionError, setActionError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [isSaving, startSaveTransition] = useTransition();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setSelectedImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const isFirstMessage = messages.length === 0;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isFirstMessage && !selectedImage) return;

        const fd = new FormData();
        fd.set("prompt", input);
        fd.set("platform", selectedPlatform);

        const history = convertToHistoryFormat(messages);
        fd.set("history", JSON.stringify(history));

        const file = fileInputRef.current?.files?.[0];
        if (file) {
            fd.set("image", file);
        }

        setMessages((prev) => [
            ...prev,
            createMessage("user", input, selectedImage ?? undefined),
        ]);
        setInput("");
        setSelectedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setActionError(null);
        setSaveSuccess(null);

        startTransition(async () => {
            const result: SendMessageActionResult = await sendMessageWithContextAction(null, fd);
            if (result.success) {
                setMessages((prev) => [
                    ...prev,
                    createMessage("assistant", result.data.message, undefined, result.data.structuredContent),
                ]);
            } else {
                const errorMessage = result.errors?.global?.[0] || "Erro ao gerar conteúdo.";
                setActionError(errorMessage);
            }
        });
    };

    const handleSaveContent = (messageId: string) => {
        const message = messages.find(m => m.id === messageId);
        if (!message?.structuredContent) {
            setActionError("Conteúdo não disponível para salvar.");
            return;
        }

        startSaveTransition(async () => {
            const result = await saveContentAction(message.structuredContent!);
            if (result.success) {
                setSaveSuccess("Conteúdo salvo com sucesso!");
                setTimeout(() => setSaveSuccess(null), 3000);
            } else {
                const errorMessage = result.errors?.global?.[0] || "Erro ao salvar conteúdo.";
                setActionError(errorMessage);
            }
        });
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return {
        messages,
        input,
        selectedImage,
        selectedPlatform,
        isFirstMessage,
        isLoading: isPending,
        isSaving,
        actionError,
        saveSuccess,
        messagesEndRef,
        fileInputRef,
        handleImageChange,
        handleSubmit,
        handleSaveContent,
        setInput,
        setSelectedImage,
        setSelectedPlatform,
    };
}
