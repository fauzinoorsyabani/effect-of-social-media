"""Feature engineering module for digital lifestyle and student wellbeing metrics.

Start With WHY:
- Why Pandas? Vectorized column expressions execute native C loops without Python iteration overhead.
- Why NumPy? np.maximum handles boundary protection (zero division) in SIMD vector instructions.
- Why Domain Features? Raw features alone (e.g., Daily Screen Hours) miss the non-linear interaction
  with circadian biology. An 8-hour screen day is harmless if sleep is 9 hours, but catastrophic
  if sleep is 4 hours. Hence, interaction terms (ratios & deficits) are required.
"""
import pandas as pd
import numpy as np
from src.config import ORDINAL_MAPPING


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Engineer domain-specific behavioral and physiological interaction features.

    Parameters
    ----------
    df : pd.DataFrame
        Raw or pre-split DataFrame containing student behavioral columns.

    Returns
    -------
    pd.DataFrame
        Enriched DataFrame with interaction terms and circadian ratios.
    """
    df = df.copy()

    # 1. Total estimated weekly screen hours
    # WHY: Captures cumulative chronic exposure vs acute daily snapshots.
    if "Daily_Usage_Hours" in df.columns and "Weekend_Extra_Hours" in df.columns:
        df["Total_Weekly_Screen_Hours"] = (
            df["Daily_Usage_Hours"] * 5 + (df["Daily_Usage_Hours"] + df["Weekend_Extra_Hours"]) * 2
        )

    # 2. Screen to Sleep Ratio (The Displacement Mechanism)
    # WHY: The primary causal mechanism where screen time cannibalizes restorative sleep.
    # np.maximum prevents division by zero while preserving monotonic gradient signals.
    if "Daily_Usage_Hours" in df.columns and "Sleep_Duration_Hours" in df.columns:
        df["Screen_to_Sleep_Ratio"] = df["Daily_Usage_Hours"] / np.maximum(
            df["Sleep_Duration_Hours"], 1.0
        )

    # 3. Sleep Deprivation Threshold Flag (< 6 hours of sleep)
    # WHY: Biological threshold for acute prefrontal cortex attention impairment.
    if "Sleep_Duration_Hours" in df.columns:
        df["Is_Sleep_Deprived"] = (df["Sleep_Duration_Hours"] < 6.0).astype(int)

    # 4. Late-Night Exposure Index
    # WHY: Direct proxy for circadian melatonin suppression before sleep onset.
    if "Late_Night_Usage" in df.columns and "Daily_Usage_Hours" in df.columns:
        late_night_num = df["Late_Night_Usage"].astype(int)
        df["Late_Night_Exposure_Index"] = late_night_num * df["Daily_Usage_Hours"]

    # 5. Sleep Quality Deficit Interaction
    # WHY: Multiplicative penalty when high screen time co-occurs with poor sleep quality.
    if "Sleep_Quality_Score" in df.columns and "Daily_Usage_Hours" in df.columns:
        df["Sleep_Deficit_Impact"] = (10 - df["Sleep_Quality_Score"]) * df["Daily_Usage_Hours"]

    # 6. Ordinal Social Comparison Encoding
    # WHY: Linearizes ordered subjective frequency ('Never' to 'Always') into numeric rank.
    if "Social_Comparison_Frequency" in df.columns:
        mapping = ORDINAL_MAPPING["Social_Comparison_Frequency"]
        df["Social_Comparison_Level"] = df["Social_Comparison_Frequency"].map(mapping).fillna(2)

    return df
