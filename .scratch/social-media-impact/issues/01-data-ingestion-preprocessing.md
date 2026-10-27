# 01: Data Ingestion & Leak-Free Preprocessing Pipeline

**What to build:** An automated data loading and modular preprocessing engine that acquires the Kaggle dataset (`harishyadav0506/impact-of-social-media-on-life`), splits data cleanly into stratified train/validation/test sets (80/10/10), applies leak-free imputation (Median/KNN strictly fit on training data), scales numerical features, and encodes categorical and ordinal variables.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Directory layout setup (`data/raw/`, `data/processed/`, `src/`, `tests/`, `notebooks/`)
- [x] `src/data_loader.py` implemented with `kagglehub` automated download and local fallback
- [x] `src/preprocessor.py` implemented with scikit-learn ColumnTransformer / Pipeline
- [x] `src/features.py` implemented for engineered digital lifestyle metrics (e.g. `Screen_to_Sleep_Ratio`, `Weekend_Surge`)
- [x] Leak-free train/val/test splits saved to `data/processed/`
- [x] Unit tests in `tests/test_preprocessor.py` verifying zero data leakage and NaN-free outputs passing cleanly
