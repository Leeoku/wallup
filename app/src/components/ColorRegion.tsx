import { useState } from "react";
import { Button, Group, Tooltip, Text, Box } from "@mantine/core";

interface ColorRegionProps {
    palette: string[];
}

export default function ColorRegion({ palette }:ColorRegionProps) {
    const [wallColor, setWallColor] = useState<string | null>(null);
    const [floorColor, setFloorColor] = useState<string | null>(null);

    return (
        <Box>
            <Text size="lg" mb="md">Step 4: Select recommended color for image region</Text>

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
                                border: wallColor === color ? "3px solid #fff" : "3px solid transparent",
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
                                border: floorColor === color ? "3px solid #fff" : "3px solid transparent",
                                cursor: "pointer",
                            }}
                            onClick={() => setFloorColor(color)}
                        />
                    </Tooltip>
                ))}
                {floorColor && <Text size="md">{floorColor}</Text>}
            </Group>

            <Button mt="md">
                Render
            </Button>
        </Box>
    );
}
