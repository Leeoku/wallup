import "@mantine/core/styles.css";
import { useState } from "react";
import { MantineProvider, Container, Flex } from "@mantine/core";
import { theme } from "./theme";
import ColorPickerList from "./components/ColorInputList";
import ColorMind from "./components/ColorMind";
import ColorRegion from "./components/ColorRegion";
import { useColorMind } from "./hooks/useColorMind";

export const defaultColor = "#ed8c05";

export default function App() {
  const [colors, setColors] = useState<string[]>([defaultColor]);
  const { palette, loading, recommend } = useColorMind(colors);

  return (
    <MantineProvider theme={theme}>
      <Container size="lg" py="xl">
        <Flex wrap="wrap">
          <ColorPickerList colors={colors} onColorsChange={setColors} />
        </Flex>
        <ColorMind palette={palette} loading={loading} recommend={recommend} colorsCount={colors.length} />
        <ColorRegion palette={palette} />
      </Container>
    </MantineProvider>
  );
}
