import { Button, Group, Tooltip, Text, Box } from "@mantine/core";
import { IconWand } from "@tabler/icons-react";

interface ColorMindProps {
  palette: string[];
  loading: boolean;
  recommend: () => Promise<void>;
  colorsCount: number;
}

export default function ColorMind({ palette, loading, recommend, colorsCount }: ColorMindProps) {

  return (
    <Box py="xl">
      <Text size="lg" mb="md">
        Step 3: Recommend colors based on neural network trained on art and media. Note input colors may change slightly for harmony.
      </Text>
      <Group>
        <Button onClick={recommend} loading={loading} mt="md">
          <IconWand />
          AI Recommend palette
        </Button>
        <Text size="xs" c="dimmed" mt="md">
          White border = your colors, rest = recommended
        </Text>
      </Group>
      {palette.length > 0 && (
        <Group mt="sm">
          {palette.map((color, i) => (
            <Box key={i}>
              <Tooltip label={color}>
                <Box
                  w={60}
                  h={60}
                  bg={color}
                  style={{
                    borderRadius: 4,
                    border: i < colorsCount ? "4px solid #fff" : "none",
                  }}
                />
              </Tooltip>
              <Text>{color}</Text>
            </Box>
          ))}
        </Group>
      )}
    </Box>
  );
}
