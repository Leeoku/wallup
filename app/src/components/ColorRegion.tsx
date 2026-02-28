import { Button, Group, Tooltip, Text, Box } from "@mantine/core";
import { useRecolor } from "../hooks/useRecolor";

interface ColorRegionProps {
    palette: string[];
    filename: string | null;
    onRender?: (outputUrl: string) => void;
}

export default function ColorRegion({ palette, filename, onRender }: ColorRegionProps) {
    const { wallColor, setWallColor, floorColor, setFloorColor, loading, error, canRender, render } = useRecolor({ filename, onRender });

    return (
        <Box>
            <Text size="lg" mb="md">Step 4: Choose region colors</Text>

            <Text mb="md">Wall Color</Text>
            <Group mb="md">
                {palette.map((color) => (
                    <Tooltip key={color} label={color}>
                        <Box
                            w={60}
                            h={60}
                            bg={color}
                            style={{
                                borderRadius: 4,
                                boxShadow: wallColor === color ? "0 0 0 2px #1a1a1a, 0 0 0 4px #fff" : "none",
                                cursor: "pointer",
                            }}
                            onClick={() => setWallColor(color)}
                        />
                    </Tooltip>
                ))}
                {wallColor && <Text size="md">{wallColor}</Text>}
            </Group>

            <Text mb="md">Floor Color</Text>
            <Group mb="md">
                {palette.map((color) => (
                    <Tooltip key={color} label={color}>
                        <Box
                            w={60}
                            h={60}
                            bg={color}
                            style={{
                                borderRadius: 4,
                                boxShadow: floorColor === color ? "0 0 0 2px #1a1a1a, 0 0 0 4px #fff" : "none",
                                cursor: "pointer",
                            }}
                            onClick={() => setFloorColor(color)}
                        />
                    </Tooltip>
                ))}
                {floorColor && <Text size="md">{floorColor}</Text>}
            </Group>

            {error && <Text size="sm" c="red" mb="xs">{error}</Text>}
            <Button mt="md" onClick={render} loading={loading} disabled={!canRender}>
                Render
            </Button>
            {!canRender && (
                <Text size="xs" c="dimmed" mt="xs">
                    Select wall and floor colors to render
                </Text>
            )}
        </Box>
    );
}
