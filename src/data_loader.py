"""Data loader module with automated KaggleHub fallback and schema validation."""
from pathlib import Path
import logging
import pandas as pd
from src.config import (
    RAW_DATA_PATH,
    ID_COL,
    TARGET_CLASSIFICATION,
    TARGET_REGRESSION_GPA,
    NUMERIC_FEATURES,
    CATEGORICAL_NOMINAL_FEATURES,
)

logger = logging.getLogger(__name__)


def download_from_kaggle(destination_path: Path = RAW_DATA_PATH) -> Path:
    """Download the dataset from Kaggle via kagglehub if not present locally."""
    try:
        import kagglehub
        import shutil

        logger.info("Downloading dataset from Kaggle Hub...")
        download_dir = kagglehub.dataset_download(
            "harishyadav0506/impact-of-social-media-on-life"
        )
        downloaded_file = Path(download_dir) / "Social_media_impact_on_life.csv"
        destination_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(downloaded_file, destination_path)
        logger.info(f"Dataset successfully saved to {destination_path}")
        return destination_path
    except Exception as e:
        logger.error(f"Failed to download via kagglehub: {e}")
        raise RuntimeError(f"Unable to download dataset: {e}") from e


def validate_schema(df: pd.DataFrame) -> bool:
    """Validate that required columns exist in the DataFrame."""
    required = [ID_COL, TARGET_CLASSIFICATION, TARGET_REGRESSION_GPA] + [
        c for c in NUMERIC_FEATURES if c in df.columns
    ] + [c for c in CATEGORICAL_NOMINAL_FEATURES if c in df.columns]

    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns in dataset: {missing}")

    if len(df) == 0:
        raise ValueError("Dataset is empty!")

    return True


def load_raw_data(data_path: Path = None) -> pd.DataFrame:
    """Load raw dataset from disk, downloading if missing, and validate schema."""
    target_path = Path(data_path) if data_path else RAW_DATA_PATH

    if not target_path.exists():
        logger.warning(f"File not found at {target_path}. Attempting download...")
        target_path = download_from_kaggle(target_path)

    df = pd.read_csv(target_path)
    validate_schema(df)
    logger.info(f"Loaded {len(df)} records with {df.shape[1]} columns from {target_path}")
    return df
