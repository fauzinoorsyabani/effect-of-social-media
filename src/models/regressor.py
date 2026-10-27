"""Regression module for predicting Academic Performance (GPA) and Mental Health Index."""
from pathlib import Path
import json
import logging
import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import root_mean_squared_error, mean_absolute_error, r2_score
from xgboost import XGBRegressor

from src.config import (
    MODELS_DIR,
    PROCESSED_DATA_DIR,
    RANDOM_SEED,
    TARGET_REGRESSION_GPA,
    TARGET_REGRESSION_MENTAL,
)
from src.preprocessor import DataPreprocessor

logger = logging.getLogger(__name__)


def train_and_compare_regressors(
    train_path: Path = PROCESSED_DATA_DIR / "train.csv",
    val_path: Path = PROCESSED_DATA_DIR / "val.csv",
    test_path: Path = PROCESSED_DATA_DIR / "test.csv",
    target_col: str = TARGET_REGRESSION_GPA,
    save_models: bool = True,
):
    """Train and evaluate Ridge, Random Forest, and XGBoost regressors on target_col."""
    train_df = pd.read_csv(train_path)
    val_df = pd.read_csv(val_path)
    test_df = pd.read_csv(test_path)

    # For GPA prediction, drop rows where target is missing in train/val/test evaluation
    # Or median-impute target ground truth only if needed. In strict ML practice, drop unlabelled target rows.
    train_eval_df = train_df.dropna(subset=[target_col]).reset_index(drop=True)
    val_eval_df = val_df.dropna(subset=[target_col]).reset_index(drop=True)
    test_eval_df = test_df.dropna(subset=[target_col]).reset_index(drop=True)

    # Preprocessor WITHOUT target in features
    include_gpa = (target_col != TARGET_REGRESSION_GPA)
    preprocessor = DataPreprocessor(
        include_gpa_in_features=include_gpa,
        exclude_cols=[target_col],
    )
    preprocessor.fit(train_eval_df)

    X_train = preprocessor.transform(train_eval_df)
    y_train = train_eval_df[target_col].values

    X_val = preprocessor.transform(val_eval_df)
    y_val = val_eval_df[target_col].values

    X_test = preprocessor.transform(test_eval_df)
    y_test = test_eval_df[target_col].values

    models = {
        "Ridge": Ridge(alpha=1.0, random_state=RANDOM_SEED),
        "RandomForestRegressor": RandomForestRegressor(
            n_estimators=200,
            max_depth=10,
            random_state=RANDOM_SEED,
            n_jobs=-1,
        ),
        "XGBRegressor": XGBRegressor(
            n_estimators=200,
            max_depth=5,
            learning_rate=0.05,
            random_state=RANDOM_SEED,
            n_jobs=-1,
        ),
    }

    results = {}
    best_model_name = None
    best_val_r2 = -float("inf")
    fitted_models = {}

    for name, model in models.items():
        logger.info(f"Training {name} for target '{target_col}'...")
        model.fit(X_train, y_train)
        fitted_models[name] = model

        # Val metrics
        y_val_pred = model.predict(X_val)
        val_rmse = float(root_mean_squared_error(y_val, y_val_pred))
        val_mae = float(mean_absolute_error(y_val, y_val_pred))
        val_r2 = float(r2_score(y_val, y_val_pred))

        # Test metrics
        y_test_pred = model.predict(X_test)
        test_rmse = float(root_mean_squared_error(y_test, y_test_pred))
        test_mae = float(mean_absolute_error(y_test, y_test_pred))
        test_r2 = float(r2_score(y_test, y_test_pred))

        results[name] = {
            "val_rmse": round(val_rmse, 4),
            "val_mae": round(val_mae, 4),
            "val_r2": round(val_r2, 4),
            "test_rmse": round(test_rmse, 4),
            "test_mae": round(test_mae, 4),
            "test_r2": round(test_r2, 4),
        }

        if val_r2 > best_val_r2:
            best_val_r2 = val_r2
            best_model_name = name

    logger.info(f"Best Regressor for {target_col}: {best_model_name} with Val R²: {best_val_r2:.4f}")

    # Feature importances from RF
    rf_model = fitted_models.get("RandomForestRegressor")
    importances = {}
    if rf_model is not None and hasattr(rf_model, "feature_importances_"):
        for f_name, imp in zip(preprocessor.feature_names_, rf_model.feature_importances_):
            importances[f_name] = round(float(imp), 4)
        importances = dict(sorted(importances.items(), key=lambda x: x[1], reverse=True))

    output = {
        "target": target_col,
        "best_model": best_model_name,
        "models": results,
        "feature_importances": importances,
    }

    if save_models:
        MODELS_DIR.mkdir(parents=True, exist_ok=True)
        slug = "gpa" if target_col == TARGET_REGRESSION_GPA else "mental_health"
        joblib.dump(fitted_models[best_model_name], MODELS_DIR / f"regressor_{slug}.joblib")
        preprocessor.save(MODELS_DIR / f"regressor_{slug}_preprocessor.joblib")
        with open(MODELS_DIR / f"regression_{slug}_metrics.json", "w", encoding="utf-8") as f:
            json.dump(output, f, indent=2)

    return output


def run_all_regressions():
    """Train regressors for both GPA and Mental Health Index."""
    gpa_res = train_and_compare_regressors(target_col=TARGET_REGRESSION_GPA)
    mental_res = train_and_compare_regressors(target_col=TARGET_REGRESSION_MENTAL)
    return {"gpa": gpa_res, "mental_health": mental_res}


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    all_res = run_all_regressions()
    print("Regression Results Summary:")
    print(json.dumps(all_res, indent=2))
