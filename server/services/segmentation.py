"""
Uses the HuggingFace InferenceClient to perform semantic segmentation
with segformer-b5-finetuned-ade-640-640, then extracts binary masks
for all regions defined in REGION_LABELS in a single API call.
"""
from pathlib import Path

import numpy as np
from PIL import Image
from huggingface_hub import InferenceClient

from config import settings
from constants import REGION_LABELS

MODEL = "nvidia/segformer-b5-finetuned-ade-640-640"


async def segment_regions(image_path: Path) -> dict[str, np.ndarray | None]:
    """
    Makes a single segmentation API call and returns a binary mask per region.

    Returns:
        dict mapping region name -> bool mask (H x W) where True = region pixel,
        or None if no segments matched for that region.
        e.g. {"wall": np.ndarray, "floor": None}
    """
    client = InferenceClient(token=settings.hf_api_token)

    with Image.open(image_path).convert("RGB") as img:
        width, height = img.size

    segments = client.image_segmentation(image=str(image_path), model=MODEL)

    masks = {}
    found = {}
    for region in REGION_LABELS:
        masks[region] = np.zeros((height, width), dtype=bool)
    for region in REGION_LABELS:
        found[region] = False

    for segment in segments:
        label: str = segment.label.lower()
        for region, labels in REGION_LABELS.items():
            if label in labels:
                # segment.mask is a PIL Image returned by the InferenceClient.
                # Convert to grayscale with half threshold to get binary mask
                mask_arr = np.array(segment.mask.convert("L")) > 128
                masks[region] = np.logical_or(masks[region], mask_arr)
                found[region] = True

    return {region: masks[region] if found[region] else None for region in REGION_LABELS}
