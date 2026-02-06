import { useState } from "react";
import { LastContentProps } from "./lastcontent.model";

export function useLastContentViewModel({ lastContent }: LastContentProps) {
    const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
    const [hoveredContentId, setHoveredContentId] = useState<number | null>(null);

    const handleContentClick = (id: number) => {
        setSelectedContentId(id);
    };

    const handleContentHover = (id: number | null) => {
        setHoveredContentId(id);
    };

    const hasContent = lastContent && lastContent.length > 0;

    const getContentById = (id: number) => {
        return lastContent.find(content => content.id === id);
    };

    const sortedContent = lastContent
        ? [...lastContent].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        : [];

    return {
        selectedContentId,
        hoveredContentId,
        handleContentClick,
        handleContentHover,
        hasContent,
        getContentById,
        sortedContent,
    };
}
