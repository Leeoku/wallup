import { ColorInput, Button, Group, Text, SimpleGrid } from "@mantine/core";
import { defaultColor } from "../App";
import { useColorList } from "../hooks/useColorList";

interface Props {
  colors: string[];
  onColorsChange: (colors: string[]) => void;
}

export default function ColorInputList({ colors, onColorsChange }: Props) {
  const { updateColor, addColor, removeColor, MAX_COLORS } = useColorList(colors, onColorsChange);

  return (
    <Group>
      <Text size="lg" mb="md">
        Step 2: Color PlayGround
      </Text>
      <Text size="lg" mb="md">
        ({colors.length}/{MAX_COLORS} colors used)
      </Text>
      <SimpleGrid cols={MAX_COLORS}>
        {colors.map((color, index) => (
          <Group key={index}>
            <ColorInput
              value={color}
              onChange={(value) => updateColor(index, value)}
              format="hex"
              defaultValue={defaultColor}
              withEyeDropper={false}
            />
            {colors.length > 1 && (
              <Button variant="subtle" color="red" onClick={() => removeColor(index)}>
                Remove
              </Button>
            )}
          </Group>
        ))}

        {colors.length < MAX_COLORS && (
          <Button variant="light" onClick={addColor}>
            Add color
          </Button>
        )}
      </SimpleGrid>
    </Group>
  );
}
