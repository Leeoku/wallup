from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    hf_api_token: str
    input_folder: str = "./images/input"
    output_folder: str = "./images/output"

    class Config:
        env_file = ".env"


settings = Settings()
