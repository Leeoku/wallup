import { useState } from "react";

const BASE_URL = "http://localhost:8000";

interface UseRecolorOptions {
    filename: string | null;
    onRender?: (outputUrl: string) => void;
}

export function useRecolor({ filename, onRender }: UseRecolorOptions) {
    const [wallColor, setWallColor] = useState<string | null>(null);
    const [floorColor, setFloorColor] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canRender = !!filename && !!wallColor && !!floorColor;

    const render = async () => {
        if (!canRender) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${BASE_URL}/images/recolor`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    filename,
                    regions: { wall: wallColor, floor: floorColor },
                }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail ?? "Render failed");
            }
            const data = await res.json();
            const outputFilename = data.output_path.split("/").at(-1);
            onRender?.(`${BASE_URL}/output/${outputFilename}`);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return { wallColor, setWallColor, floorColor, setFloorColor, loading, error, canRender, render };
}
