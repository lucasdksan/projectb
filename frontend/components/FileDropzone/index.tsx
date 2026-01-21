"use client";

import { useCallback, useRef, useState } from "react";

interface FileDropzoneProps {
    accept?: string[];
    multiple?: boolean;
    onFilesChange?: (files: File[]) => void;
}

type FileItem = {
    file: File;
    previewUrl?: string;
};

export default function FileDropzone({
    accept = ["image/*", "application/pdf"],
    multiple = true,
    onFilesChange,
}: FileDropzoneProps) {
    const [files, setFiles] = useState<FileItem[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAddFiles = (selectedFiles: FileList | null) => {
        if (!selectedFiles) return;

        const newFiles: FileItem[] = Array.from(selectedFiles).map((file) => ({
            file,
            previewUrl: file.type.startsWith("image/")
                ? URL.createObjectURL(file)
                : undefined,
        }));

        const updated = [...files, ...newFiles];
        setFiles(updated);

        // notifica o pai depois
        onFilesChange?.(updated.map((f) => f.file));
    };


    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            handleAddFiles(e.dataTransfer.files);
        },
        []
    );

    const handleClick = () => inputRef.current?.click();

    return (
        <div className="w-full space-y-3">
            {/* Dropzone */}
            <div
                onClick={handleClick}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                tabIndex={0}
                className="border-2 border-dashed border-gray-300 p-4 rounded-lg
                   flex flex-col items-center justify-center gap-2 cursor-pointer
                   hover:border-blue-500 focus:border-blue-500 focus:outline-none
                   transition-colors"
            >
                <p className="text-sm text-gray-600">Drag & drop files or click to upload</p>
                <p className="text-xs text-gray-400">
                    Accepted: {accept.join(", ")}
                </p>
                <input
                    type="file"
                    ref={inputRef}
                    className="hidden"
                    multiple={multiple}
                    accept={accept.join(",")}
                    onChange={(e) => handleAddFiles(e.target.files)}
                />
            </div>

            {/* Preview list */}
            {files.length > 0 && (
                <div className="space-y-1">
                    {files.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-2 rounded-md border text-sm bg-gray-50"
                        >
                            {/* Thumbnail */}
                            <div className="flex items-center gap-2">
                                {item.previewUrl ? (
                                    <img
                                        src={item.previewUrl}
                                        alt={item.file.name}
                                        className="w-10 h-10 rounded object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded text-xs">
                                        PDF
                                    </div>
                                )}
                                <span className="truncate max-w-[150px]">{item.file.name}</span>
                            </div>

                            {/* Remove */}
                            <button
                                className="text-red-500 text-xs hover:underline"
                                onClick={() =>
                                    setFiles((prev) =>
                                        prev.filter((_, idx) => idx !== i)
                                    )
                                }
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}