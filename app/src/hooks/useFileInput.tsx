import { useState } from "react";

async function uploadImage(file: File): Promise<string> {
    const route = "http://localhost:8000/images/";
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(route, {
        method: "POST",
        body: formData,
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail ?? "Upload failed");
    }
    const data = await response.json();
    return data.filename;
}

interface UseFileInputOptions {
    onUpload?: (filename: string, previewUrl: string) => void;
}

export function useFileInput({ onUpload }: UseFileInputOptions = {}) {
    const [filename, setFilename] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const upload = async (file: File) => {
        setLoading(true);
        setError(null);
        const localUrl = URL.createObjectURL(file);
        setPreviewUrl(localUrl);
        try {
            const name = await uploadImage(file);
            setFilename(name);
            onUpload?.(name, localUrl);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return { filename, previewUrl, loading, error, upload };
}
