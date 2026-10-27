"""Feature engineering module for digital lifestyle and wellbeing metrics."""
import pandas as pd
import numpy as np
from src.config import ORDINAL_MAPPING


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Engineer domain-specific behavioral and physiological interaction features.

    Parameters
    ----------
    df : pd.DataFrame
        Raw or pre-split DataFrame.

    Returns
    -------
    pd.DataFrame
        DataFrame with new engineered features.
    """
    df = df.copy()

    # 1. Total estimated weekly screen hours
    # Daily hours across 5 weekdays + (Daily + Weekend extra) across 2 weekend days
    if "Daily_Usage_Hours" in df.columns and "Weekend_Extra_Hours" in df.columns:
        df["Total_Weekly_Screen_Hours"] = (
            df["Daily_Usage_Hours"] * 5 + (df["Daily_Usage_Hours"] + df["Weekend_Extra_Hours"]) * 2
        )

    # 2. Screen to Sleep Ratio (Screen time displacement of sleep)
    if "Daily_Usage_Hours" in df.columns and "Sleep_Duration_Hours" in df.columns:
        df["Screen_to_Sleep_Ratio"] = df["Daily_Usage_Hours"] / np.maximum(
            df["Sleep_Duration_Hours"], 1.0
        )

    # 3. Sleep Deprivation Flag (< 6 hours of sleep)
    if "Sleep_Duration_Hours" in df.columns:
        df["Is_Sleep_Deprived"] = (df["Sleep_Duration_Hours"] < 6.0).astype(int)

    # 4. Late-Night Exposure Index
    if "Late_Night_Usage" in df.columns and "Daily_Usage_Hours" in df.columns:
        late_night_num = df["Late_Night_Usage"].astype(int)
        df["Late_Night_Exposure_Index"] = late_night_num * df["Daily_Usage_Hours"]

    # 5. Sleep Quality Deficit Interaction
    if "Sleep_Quality_Score" in df.columns and "Daily_Usage_Hours" in df.columns:
        # Scale deficit: 10 - score
        df["Sleep_Deficit_Impact"] = (10 - df["Sleep_Quality_Score"]) * df["Daily_Usage_Hours"]

    # 6. Ordinal Social Comparison Encoding
    if "Social_Comparison_Frequency" in df.columns:
        mapping = ORDINAL_MAPPING["Social_Comparison_Frequency"]
        df["Social_Comparison_Level"] = df["Social_Comparison_Frequency"].map(mapping).fillna(2)

    return df
