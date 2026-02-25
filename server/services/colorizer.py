"""
Applies a new color to wall regions in an image while preserving
lighting/texture via luminance blending.
"""
from pathlib import Path

import numpy as np
import re
from PIL import Image


def hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    hex_color = hex_color.lstrip("#")
    r, g, b = int(hex_color[0:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
    return r, g, b


def hex_color_check(s):
    # Pattern to match #RRGGBB or #RGB formats (case-insensitive)
    # ^ asserts the start of the string.
    # # matches the literal hash symbol.
    # (?:[0-9a-fA-F]{3}){1,2} matches either 3 hex chars repeated once, or twice.
    # $ asserts the end of the string.
    pattern = r"^#([0-9a-fA-F]{3}){1,2}$"
    return bool(re.match(pattern, s))


def apply_wall_color(
    image_path: Path,
    wall_mask: np.ndarray,
    hex_color: str,
    output_path: Path,
) -> None:
    """
    Recolors wall pixels to hex_color, preserving brightness from the original.
    Saves the result to output_path.
    """
    with Image.open(image_path).convert("RGB") as img:
        img_array = np.array(img, dtype=np.float32)

    target_r, target_g, target_b = hex_to_rgb(hex_color)

    # Convert original to grayscale luminance (0.0 - 1.0)
    luminance = (
        0.299 * img_array[:, :, 0]
        + 0.587 * img_array[:, :, 1]
        + 0.114 * img_array[:, :, 2]
    ) / 255.0

    # Build recolored image: target color * luminance
    recolored = img_array.copy()
    recolored[wall_mask, 0] = target_r * luminance[wall_mask]
    recolored[wall_mask, 1] = target_g * luminance[wall_mask]
    recolored[wall_mask, 2] = target_b * luminance[wall_mask]

    result = Image.fromarray(np.clip(recolored, 0, 255).astype(np.uint8))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    result.save(output_path)
