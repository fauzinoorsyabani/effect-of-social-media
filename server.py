"""High-performance ASGI server powering the modern Social Media Impact Web Application."""
from pathlib import Path
import json
import logging
import joblib
import numpy as np
import pandas as pd
from starlette.applications import Starlette
from starlette.responses import JSONResponse, FileResponse
from starlette.routing import Route, Mount
from starlette.staticfiles import StaticFiles
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
import uvicorn

from src.config import (
    MODELS_DIR,
    RAW_DATA_PATH,
    TARGET_CLASSIFICATION,
    TARGET_REGRESSION_GPA,
    TARGET_REGRESSION_MENTAL,
)
from src.features import engineer_features

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

# Global Model & Preprocessor Cache
MODELS = {}
DATA_CACHE = {}


def load_assets():
    """Load and cache trained model pipelines and dataset summaries."""
    logger.info("Loading ML models into memory...")
    MODELS["classifier"] = joblib.load(MODELS_DIR / "classifier_overall_impact.joblib")
    MODELS["classifier_prep"] = joblib.load(MODELS_DIR / "classifier_preprocessor.joblib")

    MODELS["reg_gpa"] = joblib.load(MODELS_DIR / "regressor_gpa.joblib")
    MODELS["reg_gpa_prep"] = joblib.load(MODELS_DIR / "regressor_gpa_preprocessor.joblib")

    MODELS["reg_mental"] = joblib.load(MODELS_DIR / "regressor_mental_health.joblib")
    MODELS["reg_mental_prep"] = joblib.load(MODELS_DIR / "regressor_mental_health_preprocessor.joblib")

    MODELS["kmeans"] = joblib.load(MODELS_DIR / "clustering_kmeans.joblib")
    MODELS["pca"] = joblib.load(MODELS_DIR / "clustering_pca.joblib")
    MODELS["cluster_prep"] = joblib.load(MODELS_DIR / "clustering_preprocessor.joblib")

    with open(MODELS_DIR / "clustering_metadata.json", "r") as f:
        MODELS["clustering_meta"] = json.load(f)

    with open(MODELS_DIR / "classifier_metrics.json", "r") as f:
        MODELS["classifier_metrics"] = json.load(f)

    with open(MODELS_DIR / "regression_gpa_metrics.json", "r") as f:
        MODELS["gpa_metrics"] = json.load(f)

    with open(MODELS_DIR / "regression_mental_health_metrics.json", "r") as f:
        MODELS["mental_metrics"] = json.load(f)

    # Cache dataset metrics
    df = pd.read_csv(RAW_DATA_PATH)
    DATA_CACHE["df"] = df
    DATA_CACHE["overview"] = {
        "total_students": len(df),
        "avg_daily_screen": round(float(df["Daily_Usage_Hours"].mean()), 2),
        "avg_sleep_hours": round(float(df["Sleep_Duration_Hours"].mean()), 2),
        "avg_gpa": round(float(df["Academic_Performance_GPA"].dropna().mean()), 2),
        "avg_stress": round(float(df["Perceived_Stress_Score"].dropna().mean()), 2),
        "late_night_pct": round(float(df["Late_Night_Usage"].mean() * 100), 1),
        "platform_breakdown": (
            df.groupby("Primary_Platform")
            .agg(
                count=("Student_ID", "count"),
                avg_screen=("Daily_Usage_Hours", "mean"),
                avg_stress=("Perceived_Stress_Score", "mean"),
                avg_gpa=("Academic_Performance_GPA", "mean"),
            )
            .reset_index()
            .to_dict(orient="records")
        ),
        "social_comparison_breakdown": (
            df.groupby("Social_Comparison_Frequency")
            .agg(
                count=("Student_ID", "count"),
                avg_stress=("Perceived_Stress_Score", "mean"),
                avg_mental_health=("Mental_Health_Index", "mean"),
            )
            .reindex(["Never", "Rarely", "Sometimes", "Frequently", "Always"])
            .reset_index()
            .to_dict(orient="records")
        ),
        "impact_distribution": df["Overall_Impact"].value_counts().to_dict(),
    }
    logger.info("All assets successfully loaded into memory.")


# Routes
async def index(request):
    """Serve the single page application HTML."""
    return FileResponse(STATIC_DIR / "index.html")


async def get_overview(request):
    """Return precomputed dataset summary metrics for dashboards."""
    return JSONResponse(DATA_CACHE["overview"])


async def get_models_info(request):
    """Return model benchmarks, evaluation metrics, and feature importances."""
    return JSONResponse(
        {
            "classifier": MODELS["classifier_metrics"],
            "regression_gpa": MODELS["gpa_metrics"],
            "regression_mental": MODELS["mental_metrics"],
            "clustering": MODELS["clustering_meta"],
        }
    )


async def predict(request):
    """Predict GPA, Mental Health, Overall Impact, and Archetype Persona from student inputs."""
    try:
        body = await request.json()

        age = int(body.get("age", 20))
        gender = str(body.get("gender", "Female"))
        academic_level = str(body.get("academic_level", "Undergraduate"))
        primary_platform = str(body.get("primary_platform", "Instagram"))
        device_type = str(body.get("device_type", "Smartphone"))
        daily_usage = float(body.get("daily_usage_hours", 4.5))
        weekend_extra = float(body.get("weekend_extra_hours", 1.5))
        sleep_duration = float(body.get("sleep_duration_hours", 7.0))
        sleep_quality = int(body.get("sleep_quality_score", 7))
        late_night = bool(body.get("late_night_usage", True))
        comparison = str(body.get("social_comparison_frequency", "Sometimes"))

        # Build feature dataframe
        input_row = pd.DataFrame(
            [
                {
                    "Student_ID": "USER_QUERY",
                    "Age": age,
                    "Gender": gender,
                    "Academic_Level": academic_level,
                    "Primary_Platform": primary_platform,
                    "Daily_Usage_Hours": daily_usage,
                    "Weekend_Extra_Hours": weekend_extra,
                    "Device_Type": device_type,
                    "Sleep_Duration_Hours": sleep_duration,
                    "Sleep_Quality_Score": sleep_quality,
                    "Late_Night_Usage": late_night,
                    "Social_Comparison_Frequency": comparison,
                    "Perceived_Stress_Score": np.nan,
                    "Mental_Health_Index": 55,
                    "Academic_Performance_GPA": np.nan,
                    "Overall_Impact": "Neutral",
                }
            ]
        )

        # 1. Predict GPA
        X_gpa = MODELS["reg_gpa_prep"].transform(input_row)
        pred_gpa = float(MODELS["reg_gpa"].predict(X_gpa)[0])
        pred_gpa = round(max(1.0, min(4.0, pred_gpa)), 2)
        input_row["Academic_Performance_GPA"] = pred_gpa

        # 2. Predict Mental Health Index
        X_mental = MODELS["reg_mental_prep"].transform(input_row)
        pred_mental = float(MODELS["reg_mental"].predict(X_mental)[0])
        pred_mental = round(max(1.0, min(100.0, pred_mental)), 1)
        input_row["Mental_Health_Index"] = int(round(pred_mental))

        # 3. Predict Overall Impact
        X_clf = MODELS["classifier_prep"].transform(input_row)
        clf = MODELS["classifier"]
        pred_class_idx = int(clf.predict(X_clf)[0])
        class_names = ["Negative", "Neutral", "Beneficial"]
        pred_impact = class_names[pred_class_idx]
        probs = (
            clf.predict_proba(X_clf)[0].tolist()
            if hasattr(clf, "predict_proba")
            else [0.33, 0.33, 0.34]
        )

        # 4. Predict Behavioral Cluster Archetype
        X_cluster = MODELS["cluster_prep"].transform(input_row)
        cluster_id = int(MODELS["kmeans"].predict(X_cluster)[0])
        archetype_info = MODELS["clustering_meta"]["cluster_profiles"][str(cluster_id)]

        # Generate Tailored Action Plan
        guidance = []
        screen_to_sleep = daily_usage / max(sleep_duration, 1.0)
        if screen_to_sleep > 1.0:
            guidance.append({
                "title": "Sleep Displacement Alert",
                "message": f"Screen time exceeds sleep duration (ratio: {screen_to_sleep:.2f}). Our model shows this is the strongest driver of GPA suppression.",
                "level": "critical",
            })
        if late_night:
            guidance.append({
                "title": "Circadian Protection",
                "message": "Late-night screen use significantly reduces sleep quality scores. Implement a 45-minute digital curfew before sleep.",
                "level": "warning",
            })
        if comparison in ["Frequently", "Always"]:
            guidance.append({
                "title": "Cognitive Comparison Mitigation",
                "message": "Frequent social comparison correlates with heightened perceived stress. Consider curated feeds or notification limits.",
                "level": "advisory",
            })
        if not guidance:
            guidance.append({
                "title": "Optimal Wellbeing Equilibrium",
                "message": "Current digital habits align with high academic resilience and restorative sleep cycles.",
                "level": "success",
            })

        return JSONResponse(
            {
                "success": True,
                "predictions": {
                    "gpa": pred_gpa,
                    "gpa_status": (
                        "High Academic Standing"
                        if pred_gpa >= 3.5
                        else ("Moderate Standing" if pred_gpa >= 3.0 else "Academic Risk")
                    ),
                    "mental_health_index": pred_mental,
                    "overall_impact": pred_impact,
                    "probabilities": {
                        "Negative": round(probs[0] * 100, 1),
                        "Neutral": round(probs[1] * 100, 1),
                        "Beneficial": round(probs[2] * 100, 1),
                    },
                    "archetype": archetype_info,
                    "screen_to_sleep_ratio": round(screen_to_sleep, 2),
                },
                "guidance": guidance,
            }
        )
    except Exception as e:
        logger.error(f"Prediction error: {e}", exc_info=True)
        return JSONResponse({"success": False, "error": str(e)}, status_code=500)


# Initialize Application
load_assets()

routes = [
    Route("/", index, methods=["GET"]),
    Route("/api/overview", get_overview, methods=["GET"]),
    Route("/api/predict", predict, methods=["POST"]),
    Route("/api/models", get_models_info, methods=["GET"]),
    Mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static"),
]

middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )
]

app = Starlette(debug=True, routes=routes, middleware=middleware)

if __name__ == "__main__":
    print("Starting server on http://localhost:8000 ...")
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=False)
