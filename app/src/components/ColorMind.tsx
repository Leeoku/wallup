import { useState } from "react";
import { Button, Group, Tooltip, Text, Box } from "@mantine/core";
import { IconWand } from '@tabler/icons-react';

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

interface Props {
  colors: string[];
}

export default function ColorMind({ colors }: Props) {
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

  return (
    <div>
      <Button onClick={recommend} loading={loading} mt="md">
        <IconWand/>
        AI Recommend palette
      </Button>

      {palette.length > 0 && (
        <Group mt="sm">
          {palette.map((color, i) => (
            <Tooltip key={i} label={color}>
              <Box
                w={40}
                h={40}
                bg={color}
                style={{
                  borderRadius: 4,
                  border: i < colors.length ? "2px solid #fff" : "none",
                }}
              />
            </Tooltip>
          ))}
          <Text size="xs" c="dimmed">
            White border = your colors, rest = recommended
          </Text>
        </Group>
      )}
    </div>
  );
}
