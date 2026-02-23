"""
Uses the HuggingFace InferenceClient to perform semantic segmentation
with segformer-b5-finetuned-ade-640-640, then extracts a binary mask
for 'wall' segments.
"""
from pathlib import Path

import numpy as np
from PIL import Image
from huggingface_hub import InferenceClient

from config import settings

MODEL = "nvidia/segformer-b5-finetuned-ade-640-640"
WALL_LABELS = {"wall", "walls"}


async def segment_walls(image_path: Path) -> np.ndarray | None:
    """
    Returns a binary numpy mask (H x W, bool) where True = wall pixel.
    Returns None if no wall segments are detected.
    """
    client = InferenceClient(token=settings.hf_api_token)

    with Image.open(image_path).convert("RGB") as img:
        width, height = img.size

    segments = client.image_segmentation(image=str(image_path), model=MODEL)

    wall_mask = np.zeros((height, width), dtype=bool)
    found = False

    for segment in segments:
        label: str = segment.label.lower()
        if label in WALL_LABELS:
            # segment.mask is a PIL Image returned by the InferenceClient
            mask_arr = np.array(segment.mask.convert("L")) > 128
            wall_mask |= mask_arr
            found = True

    return wall_mask if found else None
