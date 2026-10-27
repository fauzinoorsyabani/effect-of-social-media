"""Unit tests for data loading, feature engineering, and leak-free preprocessing."""
import unittest
import numpy as np
import pandas as pd
from src.data_loader import load_raw_data, validate_schema
from src.features import engineer_features
from src.preprocessor import create_splits, DataPreprocessor


class TestDataPreprocessing(unittest.TestCase):
    """Test suite for data loading and preprocessing operations."""

    @classmethod
    def setUpClass(cls):
        cls.raw_data = load_raw_data()

    def test_schema_validation(self):
        """Ensure raw dataset meets all required column schema definitions."""
        self.assertTrue(validate_schema(self.raw_data))
        self.assertEqual(len(self.raw_data), 4500)

    def test_engineer_features(self):
        """Ensure feature engineering generates required features with correct types."""
        df_feat = engineer_features(self.raw_data)
        self.assertIn("Total_Weekly_Screen_Hours", df_feat.columns)
        self.assertIn("Screen_to_Sleep_Ratio", df_feat.columns)
        self.assertIn("Is_Sleep_Deprived", df_feat.columns)
        self.assertIn("Late_Night_Exposure_Index", df_feat.columns)
        self.assertIn("Social_Comparison_Level", df_feat.columns)

        # Check validity of ratios
        self.assertTrue((df_feat["Screen_to_Sleep_Ratio"] >= 0).all())
        self.assertTrue(df_feat["Is_Sleep_Deprived"].isin([0, 1]).all())

    def test_create_splits_proportions(self):
        """Ensure splits match 80/10/10 ratio and have no overlapping IDs."""
        train_df, val_df, test_df = create_splits(
            self.raw_data, test_size=0.10, val_size=0.10
        )
        self.assertEqual(len(train_df), 3600)
        self.assertEqual(len(val_df), 450)
        self.assertEqual(len(test_df), 450)

        # Ensure no data leakage / index overlap
        train_ids = set(train_df["Student_ID"])
        val_ids = set(val_df["Student_ID"])
        test_ids = set(test_df["Student_ID"])
        self.assertEqual(len(train_ids.intersection(val_ids)), 0)
        self.assertEqual(len(train_ids.intersection(test_ids)), 0)
        self.assertEqual(len(val_ids.intersection(test_ids)), 0)

    def test_preprocessor_no_nans(self):
        """Ensure preprocessor transforms train and test without generating NaNs."""
        train_df, val_df, test_df = create_splits(self.raw_data)
        preprocessor = DataPreprocessor(include_gpa_in_features=False)
        preprocessor.fit(train_df)

        X_train_trans = preprocessor.transform(train_df)
        X_val_trans = preprocessor.transform(val_df)
        X_test_trans = preprocessor.transform(test_df)

        self.assertFalse(np.isnan(X_train_trans).any())
        self.assertFalse(np.isnan(X_val_trans).any())
        self.assertFalse(np.isnan(X_test_trans).any())
        self.assertEqual(X_train_trans.shape[0], len(train_df))
        self.assertEqual(X_val_trans.shape[0], len(val_df))
        self.assertEqual(X_test_trans.shape[0], len(test_df))


if __name__ == "__main__":
    unittest.main()
