import { Button, Group, Tooltip, Text, Box } from "@mantine/core";
import { IconWand } from "@tabler/icons-react";
import { useColorMind } from "../hooks/useColorMind";

interface Props {
  colors: string[];
}

export default function ColorMind({ colors }: Props) {
  const { palette, loading, recommend } = useColorMind(colors);

  return (
    <div>
      <Text size="lg" mb="md">
        Step 3: Recommend colors based on neural network trained on art and media. Note input colors may change slightly for harmony.
      </Text>
      <Button onClick={recommend} loading={loading} mt="md">
        <IconWand />
        AI Recommend palette
      </Button>
      {palette.length > 0 && (
        <Group mt="sm">
          {palette.map((color, i) => (
            <Box key={i}>
              <Tooltip label={color}>
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
              <Text>{color}</Text>
            </Box>
          ))}
          <Text size="xs" c="dimmed">
            White border = your colors, rest = recommended
          </Text>
        </Group>
      )}
    </div>
  );
}
