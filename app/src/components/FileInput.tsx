import { FileInput as MantineFileInput, Text, Box } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import { useFileInput } from "../hooks/useFileInput";

interface Props {
    onUpload?: (filename: string, previewUrl: string) => void;
}

export default function FileInput({ onUpload }: Props) {
    const { filename, loading, error, upload } = useFileInput({ onUpload });

    const handleChange = (file: File | null) => {
        if (file) upload(file);
    };

    return (
        <Box py="md">
            <Text size="lg" mb="md">Step 1: Upload an image</Text>
            <MantineFileInput
                placeholder="Upload file"
                accept="image/jpeg,image/png,image/webp"
                leftSection={<IconUpload size={16} />}
                disabled={loading}
                onChange={handleChange}
            />
            {loading && <Text size="sm" c="dimmed" mt="xs">Uploading...</Text>}
            {error && <Text size="sm" c="red" mt="xs">{error}</Text>}
            {filename && <Text size="sm" c="green" mt="xs">Uploaded: {filename}</Text>}
        </Box>
    );
}
