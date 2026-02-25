import "@mantine/core/styles.css";
import { useState } from "react";
import { MantineProvider, Container, Flex } from "@mantine/core";
import { theme } from "./theme";
import ColorPickerList from "./components/ColorInputList";
import ColorMind from "./components/ColorMind";

export const defaultColor = "#ed8c05";

export default function App() {
  const [colors, setColors] = useState<string[]>([defaultColor]);

  return (
    <MantineProvider theme={theme}>
      <Container size="lg" py="xl">
        <Flex wrap="wrap">
          <ColorPickerList colors={colors} onColorsChange={setColors} />
        </Flex>
        <ColorMind colors={colors} />
      </Container>
    </MantineProvider>
  );
}
