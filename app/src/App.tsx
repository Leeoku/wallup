import "@mantine/core/styles.css";
import { useState } from "react";
import { MantineProvider, Container, Grid } from "@mantine/core";
import { theme } from "./theme";
import ColorPickerList from "./components/ColorInputList";
import ColorMind from "./components/ColorMind";
import ColorRegion from "./components/ColorRegion";
import FileInput from "./components/FileInput";
import ImagePreview from "./components/ImagePreview";
import { useColorMind } from "./hooks/useColorMind";
import Title from "./components/WallupTitle";

export const defaultColor = "#ed8c05";

export default function App() {
  const [colors, setColors] = useState<string[]>([defaultColor]);
  const { palette, loading, recommend } = useColorMind(colors);
  const [filename, setFilename] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const handleUpload = (name: string, url: string) => {
    setFilename(name);
    setPreviewUrl(url);
    setOutputUrl(null);
  };

  return (
    <MantineProvider theme={theme} forceColorScheme="dark">
      <Container size="xl" py="xl">
        <Title/>
        <Grid gutter="24">
          <Grid.Col span={6}>
            <FileInput onUpload={handleUpload} />
            <ColorPickerList colors={colors} onColorsChange={setColors} />
            <ColorMind palette={palette} loading={loading} recommend={recommend} colorsCount={colors.length} />
            <ColorRegion palette={palette} filename={filename} onRender={setOutputUrl} />
          </Grid.Col>
          <Grid.Col span={6} mt="lg"style={{ position: "sticky", top: 24, alignSelf: "start" }}>
            <ImagePreview originalUrl={previewUrl} recoloredUrl={outputUrl} />
          </Grid.Col>
        </Grid>
      </Container>
    </MantineProvider>
  );
}
