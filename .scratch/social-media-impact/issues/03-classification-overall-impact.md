# 03: Multi-Class Classification Pipeline (Overall Impact)

**What to build:** An imbalanced multi-class classification pipeline predicting `Overall_Impact` (Beneficial, Neutral, Negative). Implements cost-sensitive weighting, stratified cross-validation, hyperparameter tuning, model comparison across Logistic Regression, Random Forest, and XGBoost, and SHAP explainability.

**Blocked by:** 01: Data Ingestion & Leak-Free Preprocessing Pipeline

**Status:** done

- [x] Baseline Logistic Regression with balanced class weights
- [x] Tuned Random Forest and XGBoost classifiers
- [x] Stratified 5-Fold cross-validation tracking Macro F1-score and PR-AUC
- [x] Confusion matrix and per-class precision/recall reporting
- [x] SHAP feature importance analysis identifying top factors driving negative vs. beneficial impact
- [x] Serialized best model and metadata saved in `models/`
