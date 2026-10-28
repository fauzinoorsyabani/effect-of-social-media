"""Classifier module for predicting Overall_Impact with class imbalance handling."""
from pathlib import Path
import json
import logging
import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, f1_score, confusion_matrix, precision_score, recall_score
from sklearn.model_selection import StratifiedKFold
from xgboost import XGBClassifier

from src.config import (
    MODELS_DIR,
    PROCESSED_DATA_DIR,
    RANDOM_SEED,
    TARGET_CLASSIFICATION,
    IMPACT_MAPPING,
    REVERSE_IMPACT_MAPPING,
)
from src.preprocessor import DataPreprocessor

logger = logging.getLogger(__name__)


def train_and_compare_classifiers(
    train_path: Path = PROCESSED_DATA_DIR / "train.csv",
    val_path: Path = PROCESSED_DATA_DIR / "val.csv",
    test_path: Path = PROCESSED_DATA_DIR / "test.csv",
    save_models: bool = True,
):
    """Train and benchmark Logistic Regression, Random Forest, and XGBoost classifiers."""
    # Load splits
    train_df = pd.read_csv(train_path)
    val_df = pd.read_csv(val_path)
    test_df = pd.read_csv(test_path)

    # Preprocessor with GPA included as a feature
    preprocessor = DataPreprocessor(include_gpa_in_features=True)
    preprocessor.fit(train_df)

    X_train = preprocessor.transform(train_df)
    y_train = train_df[TARGET_CLASSIFICATION].map(IMPACT_MAPPING).values

    X_val = preprocessor.transform(val_df)
    y_val = val_df[TARGET_CLASSIFICATION].map(IMPACT_MAPPING).values

    X_test = preprocessor.transform(test_path) if isinstance(test_path, pd.DataFrame) else preprocessor.transform(test_df)
    y_test = test_df[TARGET_CLASSIFICATION].map(IMPACT_MAPPING).values

    # Compute class weights for imbalanced dataset
    # WHY: The dataset is ~82% 'Beneficial', ~14% 'Neutral', and ~4% 'Negative'.
    # Without class weighting, models suffer from majority-class collapse, achieving high accuracy
    # simply by ignoring minority students. Cost-weighting penalizes errors inversely to frequency.
    classes, counts = np.unique(y_train, return_counts=True)
    total_samples = len(y_train)
    class_weights = {c: total_samples / (len(classes) * count) for c, count in zip(classes, counts)}
    sample_weights_train = np.array([class_weights[y] for y in y_train])

    models = {
        # WHY LogisticRegression with L2:
        # L2 Regularization (Ridge penalty: lambda * sum(w_j^2)) shrinks weights smoothly,
        # preventing multicollinearity without completely zeroing out interacting features.
        "LogisticRegression": LogisticRegression(
            penalty="l2",
            C=1.0,
            class_weight="balanced",
            max_iter=1000,
            random_state=RANDOM_SEED,
        ),
        # WHY RandomForest:
        # Ensembles 200 de-correlated bootstrap trees; max_depth=12 caps memorization.
        "RandomForest": RandomForestClassifier(
            n_estimators=200,
            max_depth=12,
            class_weight="balanced",
            random_state=RANDOM_SEED,
            n_jobs=-1,
        ),
        # WHY XGBoost (Champion):
        # Gradient boosted trees minimize multi-class log-loss sequentially, capturing complex
        # non-linear thresholds (e.g. sharp drops when screen-to-sleep ratio crosses 1.0).
        "XGBoost": XGBClassifier(
            n_estimators=200,
            max_depth=6,
            learning_rate=0.08,
            random_state=RANDOM_SEED,
            eval_metric="mlogloss",
            n_jobs=-1,
        ),
    }


    results = {}
    best_model_name = None
    best_val_f1 = -1.0
    fitted_models = {}

    for name, model in models.items():
        logger.info(f"Training {name}...")
        if name == "XGBoost":
            model.fit(X_train, y_train, sample_weight=sample_weights_train)
        else:
            model.fit(X_train, y_train)

        fitted_models[name] = model

        # Validation evaluation
        y_val_pred = model.predict(X_val)
        val_macro_f1 = float(f1_score(y_val, y_val_pred, average="macro"))
        val_weighted_f1 = float(f1_score(y_val, y_val_pred, average="weighted"))

        # Test evaluation
        y_test_pred = model.predict(X_test)
        test_macro_f1 = float(f1_score(y_test, y_test_pred, average="macro"))
        test_weighted_f1 = float(f1_score(y_test, y_test_pred, average="weighted"))

        conf_matrix = confusion_matrix(y_test, y_test_pred).tolist()
        report = classification_report(
            y_test,
            y_test_pred,
            target_names=[REVERSE_IMPACT_MAPPING[i] for i in sorted(classes)],
            output_dict=True,
        )

        results[name] = {
            "val_macro_f1": round(val_macro_f1, 4),
            "val_weighted_f1": round(val_weighted_f1, 4),
            "test_macro_f1": round(test_macro_f1, 4),
            "test_weighted_f1": round(test_weighted_f1, 4),
            "confusion_matrix": conf_matrix,
            "classification_report": report,
        }

        if val_macro_f1 > best_val_f1:
            best_val_f1 = val_macro_f1
            best_model_name = name

    logger.info(f"Best classifier: {best_model_name} with Val Macro F1: {best_val_f1:.4f}")

    # Feature importances for best tree-based model or RF
    rf_model = fitted_models.get("RandomForest")
    importances = {}
    if rf_model is not None and hasattr(rf_model, "feature_importances_"):
        for f_name, imp in zip(preprocessor.feature_names_, rf_model.feature_importances_):
            importances[f_name] = round(float(imp), 4)
        importances = dict(sorted(importances.items(), key=lambda x: x[1], reverse=True))

    output_payload = {
        "best_model": best_model_name,
        "models": results,
        "feature_importances": importances,
    }

    if save_models:
        MODELS_DIR.mkdir(parents=True, exist_ok=True)
        # Save best model
        best_model = fitted_models[best_model_name]
        joblib.dump(best_model, MODELS_DIR / "classifier_overall_impact.joblib")
        # Save preprocessor
        preprocessor.save(MODELS_DIR / "classifier_preprocessor.joblib")
        # Save metrics
        with open(MODELS_DIR / "classifier_metrics.json", "w", encoding="utf-8") as f:
            json.dump(output_payload, f, indent=2)
        logger.info("Saved classifier models and metrics successfully.")

    return output_payload


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    res = train_and_compare_classifiers()
    print("Classifier Results Summary:")
    print(json.dumps(res, indent=2))
