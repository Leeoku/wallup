import { Box, Text, Image } from "@mantine/core";

interface Props {
    originalUrl: string | null;
    recoloredUrl: string | null;
}

export default function ImagePreview({ originalUrl, recoloredUrl }: Props) {
    if (!originalUrl) return null;

    return (
        <Box>
            <Box mb="xl">
                <Text size="sm" mb="xs">Original Image</Text>
                <Image
                    src={originalUrl}
                    radius="sm"
                    style={{ width: "100%", maxHeight: 600, objectFit: "contain" }}
                />
            </Box>
            {recoloredUrl && (
                <Box>
                    <Text size="sm" mb="xs">Recolored</Text>
                    <Image
                        src={recoloredUrl}
                        radius="sm"
                        style={{ width: "100%", maxHeight: 600, objectFit: "contain" }}
                    />
                </Box>
            )}
        </Box>
    );
}
