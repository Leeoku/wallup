import { useState } from "react";

const PALETTE_SIZE = 5;

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  return [
    parseInt(clean.substring(0, 2), 16),
    parseInt(clean.substring(2, 4), 16),
    parseInt(clean.substring(4, 6), 16),
  ];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

export function useColorMind(colors: string[]) {
  const [palette, setPalette] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const recommend = async () => {
    setLoading(true);
    const input: ([number, number, number] | "N")[] = Array.from(
      { length: PALETTE_SIZE },
      (_, i) => (i < colors.length ? hexToRgb(colors[i]) : "N")
    );

    const res = await fetch("http://colormind.io/api/", {
      method: "POST",
      body: JSON.stringify({ model: "default", input }),
    });

    const data = await res.json();
    setPalette(data.result.map(rgbToHex));
    setLoading(false);
  };

  return { palette, loading, recommend };
}
