"""Configuration module for paths, constants, and column schemas."""
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
RAW_DATA_PATH = DATA_DIR / "raw" / "Social_media_impact_on_life.csv"
PROCESSED_DATA_DIR = DATA_DIR / "processed"
MODELS_DIR = BASE_DIR / "models"
REPORTS_DIR = BASE_DIR / "reports"

# Random Seed
RANDOM_SEED = 42

# Column Definitions
ID_COL = "Student_ID"

TARGET_CLASSIFICATION = "Overall_Impact"
TARGET_REGRESSION_GPA = "Academic_Performance_GPA"
TARGET_REGRESSION_MENTAL = "Mental_Health_Index"

NUMERIC_FEATURES = [
    "Age",
    "Daily_Usage_Hours",
    "Weekend_Extra_Hours",
    "Sleep_Duration_Hours",
    "Sleep_Quality_Score",
    "Perceived_Stress_Score",
    "Mental_Health_Index",
]

CATEGORICAL_NOMINAL_FEATURES = [
    "Gender",
    "Academic_Level",
    "Primary_Platform",
    "Device_Type",
]

CATEGORICAL_ORDINAL_FEATURES = [
    "Social_Comparison_Frequency",
]

BOOLEAN_FEATURES = [
    "Late_Night_Usage",
]

ORDINAL_MAPPING = {
    "Social_Comparison_Frequency": {
        "Never": 0,
        "Rarely": 1,
        "Sometimes": 2,
        "Frequently": 3,
        "Always": 4,
    }
}

IMPACT_MAPPING = {
    "Negative": 0,
    "Neutral": 1,
    "Beneficial": 2,
}

REVERSE_IMPACT_MAPPING = {v: k for k, v in IMPACT_MAPPING.items()}
