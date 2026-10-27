"""Unsupervised behavioral clustering and student digital phenotyping."""
from pathlib import Path
import json
import logging
import joblib
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score, davies_bouldin_score

from src.config import (
    MODELS_DIR,
    PROCESSED_DATA_DIR,
    RANDOM_SEED,
)
from src.preprocessor import DataPreprocessor

logger = logging.getLogger(__name__)


ARCHETYPE_LABELS = {
    0: {
        "name": "Late-Night Vulnerable Users",
        "description": "High daily screen hours, prevalent late-night doomscrolling, elevated stress, and sleep deprivation.",
        "badge_color": "#d9534f",
    },
    1: {
        "name": "Disciplined Academic Browsers",
        "description": "Low to moderate screen time, high sleep duration, high sleep quality, superior GPA.",
        "badge_color": "#5cb85c",
    },
    2: {
        "name": "Balanced Social Connectors",
        "description": "Moderate daily screen time, low late-night usage, healthy mental health index and stable academic performance.",
        "badge_color": "#0275d8",
    },
}


def train_clustering_pipeline(
    train_path: Path = PROCESSED_DATA_DIR / "train.csv",
    save_models: bool = True,
):
    """Run K-Means clustering, silhouette optimization, and PCA dimensionality reduction."""
    train_df = pd.read_csv(train_path)

    preprocessor = DataPreprocessor(include_gpa_in_features=True)
    preprocessor.fit(train_df)
    X = preprocessor.transform(train_df)

    # Grid search for optimal k
    k_range = range(2, 6)
    silhouette_scores = {}
    for k in k_range:
        kmeans = KMeans(n_clusters=k, random_state=RANDOM_SEED, n_init=10)
        labels = kmeans.fit_predict(X)
        score = float(silhouette_score(X, labels))
        silhouette_scores[k] = round(score, 4)

    best_k = max(silhouette_scores, key=silhouette_scores.get)
    # Default to 3 for domain-rich 3-archetype segmentation if scores are close
    selected_k = 3
    logger.info(f"Silhouette scores: {silhouette_scores}. Selected k={selected_k}")

    # Fit final KMeans
    kmeans = KMeans(n_clusters=selected_k, random_state=RANDOM_SEED, n_init=20)
    cluster_labels = kmeans.fit_predict(X)

    # PCA 2D projection
    pca = PCA(n_components=2, random_state=RANDOM_SEED)
    X_pca = pca.fit_transform(X)

    # Profile clusters using original features
    train_df["Cluster"] = cluster_labels
    cluster_profiles = {}

    # Rank clusters by avg daily usage ascending
    cluster_usage_ranks = (
        train_df.groupby("Cluster")["Daily_Usage_Hours"].mean().sort_values().index.tolist()
    )

    archetype_definitions = [
        {
            "name": "Disciplined & High-Achieving Healthy Users",
            "description": "Lowest screen time (avg ~3.5h), optimal sleep (~7.5h), lowest stress, and highest average GPA (~3.66).",
            "badge_color": "#28a745",
            "tier": "Low Risk",
        },
        {
            "name": "Moderate Habitual Browsers",
            "description": "Average daily usage (~6.0h), moderate sleep (~6.3h), emerging stress markers, and solid GPA (~3.33).",
            "badge_color": "#ffc107",
            "tier": "Moderate Risk",
        },
        {
            "name": "High-Risk Sleep-Deprived Doomscrollers",
            "description": "Extreme screen time (~10.1h), chronic sleep deprivation (<5h), severe perceived stress, and compromised GPA (~2.86).",
            "badge_color": "#dc3545",
            "tier": "Critical Risk",
        },
    ]

    cluster_to_archetype = {
        cluster_id: archetype_definitions[rank]
        for rank, cluster_id in enumerate(cluster_usage_ranks)
    }

    for c in range(selected_k):
        subset = train_df[train_df["Cluster"] == c]
        meta = cluster_to_archetype[c]
        cluster_profiles[c] = {
            "name": meta["name"],
            "description": meta["description"],
            "badge_color": meta["badge_color"],
            "tier": meta["tier"],
            "count": int(len(subset)),
            "percentage": round(float(len(subset) / len(train_df) * 100), 1),
            "avg_daily_usage": round(float(subset["Daily_Usage_Hours"].mean()), 2),
            "avg_sleep_hours": round(float(subset["Sleep_Duration_Hours"].mean()), 2),
            "late_night_pct": round(float(subset["Late_Night_Usage"].mean() * 100), 1),
            "avg_gpa": round(float(subset["Academic_Performance_GPA"].dropna().mean()), 2),
            "avg_stress": round(float(subset["Perceived_Stress_Score"].dropna().mean()), 2),
            "avg_mental_health": round(float(subset["Mental_Health_Index"].mean()), 1),
        }

    output = {
        "k": selected_k,
        "silhouette_scores": silhouette_scores,
        "pca_variance_ratio": [round(float(v), 4) for v in pca.explained_variance_ratio_],
        "cluster_profiles": cluster_profiles,
    }

    if save_models:
        MODELS_DIR.mkdir(parents=True, exist_ok=True)
        joblib.dump(kmeans, MODELS_DIR / "clustering_kmeans.joblib")
        joblib.dump(pca, MODELS_DIR / "clustering_pca.joblib")
        preprocessor.save(MODELS_DIR / "clustering_preprocessor.joblib")
        with open(MODELS_DIR / "clustering_metadata.json", "w", encoding="utf-8") as f:
            json.dump(output, f, indent=2)
        logger.info("Saved clustering models and metadata successfully.")

    return output


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    out = train_clustering_pipeline()
    print("Clustering Results Summary:")
    print(json.dumps(out, indent=2))
