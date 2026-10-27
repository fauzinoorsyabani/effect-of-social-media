"""Preprocessing pipeline module ensuring zero data leakage and reproducible transformations."""
from pathlib import Path
import logging
import joblib
import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from src.config import (
    CATEGORICAL_NOMINAL_FEATURES,
    IMPACT_MAPPING,
    MODELS_DIR,
    PROCESSED_DATA_DIR,
    RANDOM_SEED,
    TARGET_CLASSIFICATION,
    TARGET_REGRESSION_GPA,
)
from src.features import engineer_features

logger = logging.getLogger(__name__)


def create_splits(
    df: pd.DataFrame,
    test_size: float = 0.10,
    val_size: float = 0.10,
    stratify_col: str = TARGET_CLASSIFICATION,
    random_state: int = RANDOM_SEED,
):
    """Split DataFrame into Train, Validation, and Test sets using stratification.

    Parameters
    ----------
    df : pd.DataFrame
        Complete DataFrame.
    test_size : float
        Fraction reserved for final holdout testing.
    val_size : float
        Fraction reserved for validation.
    stratify_col : str
        Column used for stratified splitting.
    random_state : int
        Seed for reproducibility.

    Returns
    -------
    tuple of (pd.DataFrame, pd.DataFrame, pd.DataFrame)
        (train_df, val_df, test_df)
    """
    stratify = df[stratify_col] if stratify_col in df.columns else None

    n_test = int(round(len(df) * test_size))
    n_val = int(round(len(df) * val_size))

    # First split: train+val vs test
    train_val_df, test_df = train_test_split(
        df,
        test_size=n_test,
        random_state=random_state,
        stratify=stratify,
    )

    # Second split: train vs val
    stratify_train_val = (
        train_val_df[stratify_col] if stratify_col in train_val_df.columns else None
    )
    train_df, val_df = train_test_split(
        train_val_df,
        test_size=n_val,
        random_state=random_state,
        stratify=stratify_train_val,
    )

    logger.info(
        f"Split data into Train: {len(train_df)}, Val: {len(val_df)}, Test: {len(test_df)}"
    )
    return train_df.reset_index(drop=True), val_df.reset_index(drop=True), test_df.reset_index(drop=True)


class DataPreprocessor:
    """Preprocess features with leak-free transformation pipeline."""

    def __init__(
        self,
        include_gpa_in_features: bool = False,
        exclude_cols: list[str] | None = None,
    ):
        self.include_gpa = include_gpa_in_features
        self.exclude_cols = set(exclude_cols or [])
        all_numeric = [
            "Age",
            "Daily_Usage_Hours",
            "Weekend_Extra_Hours",
            "Sleep_Duration_Hours",
            "Sleep_Quality_Score",
            "Perceived_Stress_Score",
            "Mental_Health_Index",
            "Total_Weekly_Screen_Hours",
            "Screen_to_Sleep_Ratio",
            "Is_Sleep_Deprived",
            "Late_Night_Exposure_Index",
            "Sleep_Deficit_Impact",
            "Social_Comparison_Level",
        ]
        if self.include_gpa:
            all_numeric.append("Academic_Performance_GPA")

        self.numeric_features = [col for col in all_numeric if col not in self.exclude_cols]
        self.nominal_features = [
            col for col in CATEGORICAL_NOMINAL_FEATURES if col not in self.exclude_cols
        ]
        self.pipeline: ColumnTransformer | None = None
        self.feature_names_: list[str] | None = None

    def _build_pipeline(self) -> ColumnTransformer:
        numeric_transformer = Pipeline(
            steps=[
                ("imputer", SimpleImputer(strategy="median")),
                ("scaler", StandardScaler()),
            ]
        )

        categorical_transformer = Pipeline(
            steps=[
                (
                    "onehot",
                    OneHotEncoder(
                        handle_unknown="ignore",
                        sparse_output=False,
                    ),
                )
            ]
        )

        transformer = ColumnTransformer(
            transformers=[
                ("num", numeric_transformer, self.numeric_features),
                ("cat", categorical_transformer, self.nominal_features),
            ],
            remainder="drop",
        )
        return transformer

    def fit(self, X: pd.DataFrame, y=None):
        """Fit preprocessor exclusively on training data."""
        X_feat = engineer_features(X)
        self.pipeline = self._build_pipeline()
        self.pipeline.fit(X_feat)

        # Retrieve feature names
        num_names = self.numeric_features
        cat_names = list(
            self.pipeline.named_transformers_["cat"]
            .named_steps["onehot"]
            .get_feature_names_out(self.nominal_features)
        )
        self.feature_names_ = num_names + cat_names
        return self

    def transform(self, X: pd.DataFrame) -> np.ndarray:
        """Transform features using fitted pipeline."""
        if self.pipeline is None:
            raise RuntimeError("Preprocessor has not been fitted yet!")
        X_feat = engineer_features(X)
        return self.pipeline.transform(X_feat)

    def fit_transform(self, X: pd.DataFrame, y=None) -> np.ndarray:
        return self.fit(X, y).transform(X)

    def save(self, filepath: Path = MODELS_DIR / "preprocessor.joblib"):
        filepath.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(self, filepath)
        logger.info(f"Saved preprocessor to {filepath}")

    @classmethod
    def load(cls, filepath: Path = MODELS_DIR / "preprocessor.joblib"):
        return joblib.load(filepath)


def prepare_and_save_data(df: pd.DataFrame, save_dir: Path = PROCESSED_DATA_DIR):
    """Run full splitting, save raw partitions, and fit preprocessor."""
    save_dir.mkdir(parents=True, exist_ok=True)

    train_df, val_df, test_df = create_splits(df)

    # Save CSV partitions
    train_df.to_csv(save_dir / "train.csv", index=False)
    val_df.to_csv(save_dir / "val.csv", index=False)
    test_df.to_csv(save_dir / "test.csv", index=False)

    # Fit preprocessor strictly on train
    preprocessor = DataPreprocessor(include_gpa_in_features=False)
    preprocessor.fit(train_df)
    preprocessor.save()

    # Preprocessor for models where GPA is a predictor (e.g. Overall Impact classifier)
    preprocessor_with_gpa = DataPreprocessor(include_gpa_in_features=True)
    preprocessor_with_gpa.fit(train_df)
    preprocessor_with_gpa.save(MODELS_DIR / "preprocessor_with_gpa.joblib")

    logger.info("Successfully prepared and saved all splits and preprocessor objects.")
    return train_df, val_df, test_df
