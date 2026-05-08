"""Application configuration loaded from environment variables."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "NatalChart"
    app_env: str = "development"
    app_port: int = 8000
    nominatim_user_agent: str = "natal-chart-app"
    ephe_path: str = "data/ephe"
    database_url: str = "sqlite:///data/natal.db"
    log_level: str = "DEBUG"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
