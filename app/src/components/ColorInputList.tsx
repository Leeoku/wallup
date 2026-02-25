import { ColorInput, Button, Group, Text, SimpleGrid } from "@mantine/core";
import { defaultColor } from "../App";
import { IconWand } from '@tabler/icons-react';

const MAX_COLORS = 5;

interface Props {
  colors: string[];
  onColorsChange: (colors: string[]) => void;
}

export default function ColorInputList({ colors, onColorsChange }: Props) {

  const updateColor = (index: number, value: string) => {
    onColorsChange(colors.map((c, i) => (i === index ? value : c)));
  };

  const addColor = () => {
    if (colors.length < MAX_COLORS) {
      onColorsChange([...colors, defaultColor]);
    }
  };

  const removeColor = (index: number) => {
    onColorsChange(colors.filter((_, i) => i !== index));
  };

  return (
    <Group>
      <Text size="lg" mb="md">
        Color PlayGround
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
