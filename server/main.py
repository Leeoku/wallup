from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from pathlib import Path

from config import settings
from routers import images


@asynccontextmanager
async def lifespan(app: FastAPI):
    Path(settings.input_folder).mkdir(parents=True, exist_ok=True)
    Path(settings.output_folder).mkdir(parents=True, exist_ok=True)
    yield


app = FastAPI(title="Wallup", lifespan=lifespan)
app.mount("/output", StaticFiles(directory=settings.output_folder), name="output")
app.include_router(images.router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
