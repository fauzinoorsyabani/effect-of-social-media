# PulseAI: Student Digital Lifestyle & Academic Impact Platform

A production-grade, mathematically validated data science and machine learning system evaluating how digital screen exposure, late-night phone usage, and social media habits affect student academic performance (GPA), sleep architecture, perceived stress, and mental health.

Based on empirical survey data from 4,500 students (harishyadav0506/impact-of-social-media-on-life).

---

## 1. Start With WHY: The Philosophy and Scientific Rationale

### The Fundamental Problem
Higher education and adolescent development are facing an unprecedented challenge: digital displacement. The proliferation of algorithmic, infinite-scroll mobile platforms has decoupled human circadian biology from natural rest-and-recovery cycles.

Students do not merely browse social media; mobile screen habits actively displace biological sleep windows. This displacement induces a compounding cascade:
1. Circadian Disruption: Late-night screen exposure suppresses natural melatonin secretion, prolonging sleep latency and diminishing restorative slow-wave and REM sleep.
2. Cognitive Impairment: Fragmented sleep degrades prefrontal cortex function, impairing working memory, sustained attention, and academic exam synthesis.
3. Psychological Comparison: Algorithmic feeds present hyper-curated peer achievements, triggering chronic upward social comparison and elevated perceived stress.

### Why Process This Specific Dataset?
Empirical research requires high-fidelity, multidimensional observation. This dataset records 4,500 student profiles across 16 interrelated behavioral, physiological, and academic variables:
- Screen Dimensions: Daily Usage Hours, Weekend Extra Hours, Primary Platform (Instagram, TikTok, YouTube, Snapchat, Reddit, X, LinkedIn), Device Type.
- Physiological Markers: Sleep Duration Hours, Sleep Quality Score (1-10), Late-Night Screen Usage.
- Psychological Mediators: Social Comparison Frequency, Perceived Stress Score, Mental Health Index (1-100).
- Academic Endpoints: Academic Performance GPA (1.90 - 4.00), Overall Perceived Impact (Beneficial, Neutral, Negative).

### Why This Platform?
Existing wellness advice is frequently generic, moralistic, or ungrounded in personal data. PulseAI bridges data science and student self-agency:
- Translates machine learning models into real-time, non-judgmental diagnostics.
- Provides immediate mathematical projections of how adjusting 1 hour of screen time or eliminating late-night doomscrolling restores GPA and reduces clinical stress risk.
- Delivers dual-mode persistence: zero-friction local storage directly on the student's laptop or mobile device for total privacy, with optional cloud synchronization.

---

## 2. Core Empirical Findings & Mathematical Insights

1. The Sleep Displacement Mechanism:
   - The ratio of screen time to sleep hours (Screen_to_Sleep_Ratio) emerged as the single strongest negative determinant of academic GPA, accounting for 48.6% of model importance weight.
   - Students whose daily screen duration exceeds their sleep duration (ratio > 1.0) consistently register GPAs below 3.00, regardless of reported study effort.

2. Late-Night Doomscrolling Penalties:
   - Screen use within 45 minutes of sleep correlates with a 2-point median decline in Sleep Quality Score (on a 10-point scale).
   - Sleep quality deficits interact multiplicatively with total screen time, depressing both the Mental Health Index and cumulative GPA.

3. Platform Stress Variation (ANOVA p < 0.05):
   - One-way ANOVA confirms statistically significant differences in perceived stress across primary platforms.
   - Short-form algorithmic video feeds (TikTok, Instagram) are associated with higher median stress and higher late-night usage rates than informational feeds (YouTube, LinkedIn).

4. Upward Social Comparison Curve:
   - Monotonic positive correlation between social comparison frequency and perceived stress (Spearman r = 0.52).
   - Students reporting "Always" or "Frequently" exhibit the lowest mental resilience scores across the cohort.

---

## 3. Machine Learning Architecture & Benchmark Results

### Multi-Task Modeling Strategy
To provide comprehensive diagnostics, the system implements three distinct modeling objectives:

| Modeling Task | Objective | Selected Algorithm | Benchmark Performance |
| :--- | :--- | :--- | :--- |
| Overall Impact Classification | Predict student perception (Beneficial, Neutral, Negative) under severe 82% class imbalance | XGBoost Classifier (Cost-Weighted) | 96.22% Accuracy, 0.9225 Macro F1, 0.9632 Weighted F1 |
| Academic GPA Prediction | Continuous regression estimating Grade Point Average | Ridge Regression | Test RMSE: 0.2684, Test MAE: 0.2141, Test R²: 0.5033 |
| Mental Health Index Prediction | Continuous regression estimating psychological resilience (1-100) | Ridge Regression | Test RMSE: 5.4712, Test MAE: 4.4572, Test R²: 0.8173 |
| Behavioral Phenotyping | Unsupervised clustering of digital lifestyle archetypes | K-Means (k=3) + PCA 2D Latent Projection | Silhouette Score: 0.3298, PCA Variance: 58.1% |

### Identified Student Behavioral Archetypes
1. Disciplined & High-Achieving Healthy Users (50.2% of cohort):
   - Profile: Low screen time (avg 3.5h), optimal sleep (avg 7.5h), low stress (avg 9.1/40), superior GPA (avg 3.66).
   - Risk Level: Low.
2. Moderate Habitual Browsers (35.6% of cohort):
   - Profile: Moderate screen time (avg 6.0h), moderate sleep (avg 6.3h), emerging stress (avg 15.4/40), solid GPA (avg 3.33).
   - Risk Level: Moderate.
3. High-Risk Sleep-Deprived Doomscrollers (14.2% of cohort):
   - Profile: Extreme screen time (avg 10.1h), chronic sleep deprivation (avg 4.9h), high stress (avg 24.3/40), compromised GPA (avg 2.86).
   - Risk Level: Critical.

---

## 4. Technical Architecture & File Layout

```
effect-of-social-media/
├── data/
│   ├── raw/                      # Downloaded dataset (Social_media_impact_on_life.csv)
│   ├── processed/                # Leak-free Train (3,600), Val (450), Test (450) splits
│   └── wellness_tracker.db       # SQLite storage for student assessments and history
├── models/                       # Serialized pipelines and evaluation metric JSONs
│   ├── classifier_overall_impact.joblib
│   ├── regressor_gpa.joblib
│   ├── regressor_mental_health.joblib
│   └── clustering_kmeans.joblib
├── notebooks/
│   └── 01_exploratory_data_analysis.ipynb   # Executed, publication-grade narrative EDA
├── src/
│   ├── config.py                 # Central configurations, schemas, and paths
│   ├── data_loader.py            # Automated kagglehub downloader & validator
│   ├── features.py               # Feature engineering (ratios, interaction terms)
│   ├── preprocessor.py           # Leak-free ColumnTransformer pipeline
│   └── models/
│       ├── classifier.py         # Overall Impact multi-class classifiers
│       ├── regressor.py          # Continuous GPA & Mental Health regressors
│       └── clusterer.py          # K-Means & PCA student phenotyping
├── static/
│   ├── css/
│   │   └── style.css             # Low-stress, therapeutic mental health design system
│   ├── js/
│   │   └── app.js                # Dual-mode client logic, Chart.js, and live inference
│   └── index.html                # Modern single-page application dashboard
├── tests/
│   └── test_preprocessor.py      # Automated unittest suite validating zero leakage
├── server.py                     # High-performance Starlette/Uvicorn ASGI REST API
├── requirements.txt
└── README.md
```

---

## 5. Dual-Mode Persistence Architecture

Students have differing privacy preferences regarding personal wellness data. PulseAI supports two seamless persistence models:

1. Mode 1: Device-First Private Storage (No Registration Required)
   - Every completed simulation is automatically committed to client `localStorage`.
   - Data never leaves the student's personal phone or laptop.
   - The timeline tracker chart reconstructs weekly trends directly in the client browser.

2. Mode 2: Cloud Sync & Multi-Device History (Optional Account)
   - For students switching between phone and laptop, an optional lightweight account links records to SQLite storage.
   - Full history can be exported as a structured JSON summary for consultation with academic advisors or campus counselors.

---

## 6. Installation & Quickstart

### Step 1: Clone and Install
```bash
git clone https://github.com/fauzinoorsyabani/effect-of-social-media.git
cd effect-of-social-media
pip install -r requirements.txt
```

### Step 2: Launch the Web Platform
Launch the ASGI server:
```bash
python server.py
```
Open your browser at **http://localhost:8000**.

### Step 3: Run Automated Test Suite
```bash
python -m unittest discover tests
```

### Step 4: Retrain Machine Learning Pipelines (Optional)
```bash
# 1. Prepare leak-free splits
python -c "from src.data_loader import load_raw_data; from src.preprocessor import prepare_and_save_data; prepare_and_save_data(load_raw_data())"

# 2. Train classifiers
python -m src.models.classifier

# 3. Train regressors
python -m src.models.regressor

# 4. Train clustering
python -m src.models.clusterer
```

---

## 7. Open Source License
This project is distributed under the MIT License. Free for academic, personal, and commercial research.
