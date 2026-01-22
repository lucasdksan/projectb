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
    accept = ["image/*"],
    multiple = false,
    onFilesChange,
}: FileDropzoneProps) {
    const [files, setFiles] = useState<FileItem[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAddFiles = (selectedFiles: FileList | null) => {
        if (!selectedFiles || selectedFiles.length === 0) return;

        const selectedArray = Array.from(selectedFiles);
        const filesToProcess = multiple ? selectedArray : [selectedArray[0]];

        const newFiles: FileItem[] = filesToProcess
            .filter((file): file is File => !!file)
            .map((file) => ({
                file,
                previewUrl: file.type.startsWith("image/")
                    ? URL.createObjectURL(file)
                    : undefined,
            }));

        if (newFiles.length === 0) return;

        const updated = multiple ? [...files, ...newFiles] : newFiles;
        setFiles(updated);

        onFilesChange?.(updated.map((f) => f.file));
    };

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            handleAddFiles(e.dataTransfer.files);
        },
        [multiple, files]
    );

    const handleClick = () => inputRef.current?.click();

    const removeFile = (index: number) => {
        const updated = files.filter((_, i) => i !== index);
        setFiles(updated);
        onFilesChange?.(updated.map((f) => f.file));
    };

    return (
        <div className="w-full flex justify-center py-4">
            <div
                onClick={handleClick}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                tabIndex={0}
                className="relative w-full max-w-[450px] overflow-hidden rounded-[2.5rem] cursor-pointer bg-[#F8FAFC] border-2 border-dashed border-slate-200 flex items-center justify-center transition-all hover:border-slate-400 group shadow-sm"
            >
                <div className="w-full aspect-square flex items-center justify-center">
                    {files.length > 0 && files[0].previewUrl ? (
                        <div className="relative w-full h-full overflow-hidden">
                            <img
                                src={files[0].previewUrl}
                                alt="Preview"
                                className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(0);
                                }}
                                className="absolute top-5 right-5 z-20 bg-black/40 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-md transition-all shadow-lg border border-white/20 scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 text-slate-400 group-hover:text-slate-600 transition-all duration-300">
                            <div className="p-5 rounded-4xl bg-white shadow-sm border border-slate-100 group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div className="text-center px-6">
                                <p className="text-sm font-bold tracking-tight">Coloque sua imagem aqui</p>
                                <p className="text-[10px] uppercase tracking-widest mt-1 opacity-60">JPG, PNG ou WEBP</p>
                            </div>
                        </div>
                    )}
                </div>

                <input
                    type="file"
                    ref={inputRef}
                    className="hidden"
                    multiple={multiple}
                    accept={accept.join(",")}
                    onChange={(e) => handleAddFiles(e.target.files)}
                />
            </div>
        </div>
    );
}
