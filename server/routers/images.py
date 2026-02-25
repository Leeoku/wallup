from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator
from pathlib import Path

from config import settings
from constants import REGION_LABELS, FILE_FORMATS
from services.segmentation import segment_regions
from services.colorizer import apply_region_color, hex_color_check

router = APIRouter(prefix="/images", tags=["images"])


class ColorRequest(BaseModel):
    filename: str               # file must exist in INPUT_FOLDER
    regions: dict[str, str]      # region -> hex color e.g. {"wall": "#A3C4BC"}

    @field_validator("regions")
    @classmethod
    def validate_region_keys(cls, colors: dict[str, str]) -> dict[str, str]:
        valid = set(REGION_LABELS)
        invalid = set(colors.keys()) - valid
        if invalid:
            raise ValueError(f"Invalid region(s): {invalid}. Valid regions: {valid}")
        return colors


class ColorResponse(BaseModel):
    input_path: str
    output_path: str
    regions_found: list[str]


@router.get("/list")
def list_images():
    """List all images available in the input folder."""
    folder = Path(settings.input_folder)
    files = [f.name for f in folder.iterdir() if f.suffix.lower() in FILE_FORMATS]
    return {"images": files}


@router.post("/recolor", response_model=ColorResponse)
async def recolor_regions(req: ColorRequest):
    regions_found = []
    """Segment regions in an image and apply new colors. Saves result locally."""
    input_path = Path(settings.input_folder) / req.filename
    if not input_path.exists():
        raise HTTPException(status_code=404, detail=f"File '{req.filename}' not found in input folder.")

    for region, hex_color in req.regions.items():
        if not hex_color_check(hex_color):
            raise HTTPException(status_code=422, detail=f"Invalid hex color '{hex_color}' for region '{region}'. Expected format: #RGB or #RRGGBB.")

    # Step 1: Single API call to get all region masks
    masks = await segment_regions(input_path)

    output_filename = f"{input_path.stem}_recolored{input_path.suffix}"
    output_path = Path(settings.output_folder) / output_filename
    output_url = f"/output/{output_filename}"

    # Step 2: Apply each requested color to its region, chaining on the same output
    current_input = input_path
    for region, hex_color in req.regions.items():
        mask = masks.get(region)
        if mask is None:
            continue
        apply_region_color(current_input, mask, hex_color, output_path)
        current_input = output_path
        regions_found.append(region)

    return ColorResponse(
        input_path=str(input_path),
        output_path=str(output_path) if regions_found else "",
        regions_found=regions_found,
    )
