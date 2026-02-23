from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pathlib import Path

from config import settings
from services.segmentation import segment_walls
from services.colorizer import apply_wall_color

router = APIRouter(prefix="/images", tags=["images"])


class ColorRequest(BaseModel):
    filename: str   # file must exist in INPUT_FOLDER
    color: str      # hex color e.g. "#A3C4BC"


class ColorResponse(BaseModel):
    input_path: str
    output_path: str
    walls_found: bool


@router.get("/list")
def list_images():
    """List all images available in the input folder."""
    folder = Path(settings.input_folder)
    files = [f.name for f in folder.iterdir() if f.suffix.lower() in {".jpg", ".jpeg", ".png"}]
    return {"images": files}


@router.post("/recolor", response_model=ColorResponse)
async def recolor_wall(req: ColorRequest):
    """Segment walls in an image and apply a new color. Saves result locally."""
    input_path = Path(settings.input_folder) / req.filename
    if not input_path.exists():
        raise HTTPException(status_code=404, detail=f"File '{req.filename}' not found in input folder.")

    # Step 1: Get wall mask from HuggingFace segmentation API
    wall_mask = await segment_walls(input_path)

    if wall_mask is None:
        return ColorResponse(
            input_path=str(input_path),
            output_path="",
            walls_found=False,
        )

    # Step 2: Apply color to wall regions and save
    output_filename = f"{input_path.stem}_recolored{input_path.suffix}"
    output_path = Path(settings.output_folder) / output_filename
    apply_wall_color(input_path, wall_mask, req.color, output_path)

    return ColorResponse(
        input_path=str(input_path),
        output_path=str(output_path),
        walls_found=True,
    )
