import { defaultColor } from "../App";

const MAX_COLORS = 5;

export function useColorList(colors: string[], onColorsChange: (colors: string[]) => void) {
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

  return { updateColor, addColor, removeColor, MAX_COLORS };
}
