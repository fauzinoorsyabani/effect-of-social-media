"""High-performance ASGI server powering the PulseAI Student Digital Wellness Platform.

Features:
- Sub-50ms Multi-Task ML Inference (GPA, Mental Health, Impact, Archetype)
- SQLite Persistent Storage for Assessments & Optional Student Accounts
- Dual-Mode Persistence (Device-First Local Storage & Cloud Sync API)
- Zero-Emoji Restorative Cognitive Architecture
"""
import os
import tempfile
from pathlib import Path
import json
import logging
import sqlite3
import uuid
from datetime import datetime, timezone
import hashlib
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
    DATA_DIR,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

if os.environ.get("VERCEL"):
    DB_PATH = Path(tempfile.gettempdir()) / "wellness_tracker.db"
else:
    DB_PATH = DATA_DIR / "wellness_tracker.db"


# Global Model & Preprocessor Cache
MODELS = {}
DATA_CACHE = {}


# ==========================================================
# Database Initialization
# ==========================================================
def init_db():
    """Initialize SQLite database for student assessments and optional accounts."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Users table
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )

    # Assessments table
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS assessments (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            timestamp TEXT NOT NULL,
            daily_usage_hours REAL,
            sleep_duration_hours REAL,
            sleep_quality_score INTEGER,
            primary_platform TEXT,
            late_night_usage INTEGER,
            social_comparison_frequency TEXT,
            predicted_gpa REAL,
            predicted_mental_health REAL,
            impact_class TEXT,
            archetype TEXT,
            archetype_tier TEXT,
            guidance_json TEXT
        )
        """
    )
    conn.commit()
    conn.close()
    logger.info(f"Database initialized at {DB_PATH}")


def hash_password(password: str) -> str:
    """Hash password using SHA-256 with salt."""
    salt = "pulse_wellness_salt_"
    return hashlib.sha256((salt + password).encode("utf-8")).hexdigest()


# ==========================================================
# Asset Loading
# ==========================================================
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


# ==========================================================
# Routes & Handlers
# ==========================================================
async def index(request):
    """Serve the single page application HTML."""
    return FileResponse(STATIC_DIR / "index.html")


async def favicon(request):
    """Serve the favicon in requested format (.ico, .png, .webp)."""
    path_name = request.url.path.strip("/")
    if path_name.endswith(".ico") and (STATIC_DIR / "favicon.ico").exists():
        return FileResponse(str(STATIC_DIR / "favicon.ico"), media_type="image/x-icon")
    if path_name.endswith(".png") and (STATIC_DIR / path_name).exists():
        return FileResponse(str(STATIC_DIR / path_name), media_type="image/png")
    if (STATIC_DIR / "favicon.webp").exists():
        return FileResponse(str(STATIC_DIR / "favicon.webp"), media_type="image/webp")
    return JSONResponse({"error": "No favicon"}, status_code=404)


async def logo(request):
    """Serve the PulseAI WebP logo."""
    logo_path = STATIC_DIR / "logo.webp"
    if logo_path.exists():
        return FileResponse(str(logo_path), media_type="image/webp")
    return JSONResponse({"error": "No logo"}, status_code=404)


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

        # Generate Actionable Guidance
        guidance = []
        screen_to_sleep = daily_usage / max(sleep_duration, 1.0)
        if screen_to_sleep > 1.0:
            guidance.append({
                "title": "Sleep Displacement Alert",
                "message": f"Daily screen duration exceeds sleep duration (ratio: {screen_to_sleep:.2f}). This is the primary empirical determinant of GPA degradation.",
                "level": "critical",
            })
        if late_night:
            guidance.append({
                "title": "Circadian Rhythm Protection",
                "message": "Screen exposure within 45 minutes of bedtime suppresses melatonin and diminishes restorative deep sleep. Implement a digital curfew.",
                "level": "warning",
            })
        if comparison in ["Frequently", "Always"]:
            guidance.append({
                "title": "Cognitive Comparison Mitigation",
                "message": "Frequent social comparison correlates with elevated perceived stress. Schedule intentional platform breaks or curate feeds.",
                "level": "advisory",
            })
        if not guidance:
            guidance.append({
                "title": "Optimal Wellbeing Equilibrium",
                "message": "Current habits support cognitive restoration, physiological sleep hygiene, and strong academic performance.",
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
                        "Negative": min(99.0, round(probs[0] * 100, 1)),
                        "Neutral": min(99.0, round(probs[1] * 100, 1)),
                        "Beneficial": min(99.0, round(probs[2] * 100, 1)),
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


# ==========================================================
# Assessment Persistence & History Endpoints
# ==========================================================
async def save_assessment(request):
    """Save an assessment to SQLite database for persistent timeline tracking."""
    try:
        body = await request.json()
        assessment_id = str(uuid.uuid4())
        user_id = body.get("user_id") or "anonymous_local"
        now_iso = datetime.now(timezone.utc).isoformat()

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO assessments (
                id, user_id, timestamp, daily_usage_hours, sleep_duration_hours,
                sleep_quality_score, primary_platform, late_night_usage,
                social_comparison_frequency, predicted_gpa, predicted_mental_health,
                impact_class, archetype, archetype_tier, guidance_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                assessment_id,
                user_id,
                now_iso,
                float(body.get("daily_usage_hours", 4.5)),
                float(body.get("sleep_duration_hours", 7.0)),
                int(body.get("sleep_quality_score", 7)),
                str(body.get("primary_platform", "Instagram")),
                1 if body.get("late_night_usage", True) else 0,
                str(body.get("social_comparison_frequency", "Sometimes")),
                float(body.get("predicted_gpa", 3.4)),
                float(body.get("predicted_mental_health", 75.0)),
                str(body.get("impact_class", "Beneficial")),
                str(body.get("archetype", "Disciplined Achiever")),
                str(body.get("archetype_tier", "Low Risk")),
                json.dumps(body.get("guidance", [])),
            ),
        )
        conn.commit()
        conn.close()

        return JSONResponse(
            {
                "success": True,
                "assessment_id": assessment_id,
                "timestamp": now_iso,
            }
        )
    except Exception as e:
        logger.error(f"Error saving assessment: {e}", exc_info=True)
        return JSONResponse({"success": False, "error": str(e)}, status_code=500)


async def get_history(request):
    """Retrieve history of saved assessments for timeline visualization."""
    try:
        user_id = request.query_params.get("user_id")
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        if user_id:
            cursor.execute(
                """
                SELECT * FROM assessments WHERE user_id = ? ORDER BY timestamp ASC
                """,
                (user_id,),
            )
        else:
            cursor.execute(
                """
                SELECT * FROM assessments ORDER BY timestamp DESC LIMIT 50
                """
            )

        rows = cursor.fetchall()
        history = [dict(r) for r in rows]
        conn.close()

        return JSONResponse({"success": True, "history": history})
    except Exception as e:
        logger.error(f"Error fetching history: {e}", exc_info=True)
        return JSONResponse({"success": False, "error": str(e)}, status_code=500)


# ==========================================================
# Optional Authentication Endpoints
# ==========================================================
async def register(request):
    """Create a persistent student account."""
    try:
        body = await request.json()
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")

        if not email or len(password) < 6:
            return JSONResponse(
                {"success": False, "error": "Invalid email or password (min 6 characters)."},
                status_code=400,
            )

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        user_id = str(uuid.uuid4())
        pwd_hash = hash_password(password)
        now_iso = datetime.now(timezone.utc).isoformat()

        try:
            cursor.execute(
                "INSERT INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
                (user_id, email, pwd_hash, now_iso),
            )
            conn.commit()
        except sqlite3.IntegrityError:
            conn.close()
            return JSONResponse(
                {"success": False, "error": "An account with this email already exists."},
                status_code=409,
            )

        conn.close()
        return JSONResponse({"success": True, "user_id": user_id, "email": email})
    except Exception as e:
        logger.error(f"Register error: {e}", exc_info=True)
        return JSONResponse({"success": False, "error": str(e)}, status_code=500)


async def login(request):
    """Authenticate student account."""
    try:
        body = await request.json()
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")

        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        conn.close()

        if not user or user["password_hash"] != hash_password(password):
            return JSONResponse(
                {"success": False, "error": "Invalid credentials."},
                status_code=401,
            )

        return JSONResponse(
            {"success": True, "user_id": user["id"], "email": user["email"]}
        )
    except Exception as e:
        logger.error(f"Login error: {e}", exc_info=True)
        return JSONResponse({"success": False, "error": str(e)}, status_code=500)


# ==========================================================
# Initialize Application
# ==========================================================
init_db()
load_assets()

routes = [
    Route("/", index, methods=["GET"]),
    Route("/api/overview", get_overview, methods=["GET"]),
    Route("/api/predict", predict, methods=["POST"]),
    Route("/api/models", get_models_info, methods=["GET"]),
    Route("/api/assessments/save", save_assessment, methods=["POST"]),
    Route("/api/assessments/history", get_history, methods=["GET"]),
    Route("/api/auth/register", register, methods=["POST"]),
    Route("/api/auth/login", login, methods=["POST"]),
    Route("/favicon.webp", favicon, methods=["GET"]),
    Route("/favicon.ico", favicon, methods=["GET"]),
    Route("/favicon.png", favicon, methods=["GET"]),
    Route("/favicon-32x32.png", favicon, methods=["GET"]),
    Route("/apple-touch-icon.png", favicon, methods=["GET"]),
    Route("/logo.webp", logo, methods=["GET"]),
    Mount("/assets", StaticFiles(directory=str(STATIC_DIR / "assets")), name="assets"),
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
    import os
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"Starting PulseAI server on http://{host}:{port} ...")
    uvicorn.run(app, host=host, port=port)

