# Maps region name -> set of model labels that belong to that region.
REGION_LABELS: dict[str, set[str]] = {
    "wall": {"wall"},
    "floor": {"floor"},
}

FILE_FORMATS: set[str] = {".jpg", ".jpeg", ".png", ".webp"}