# 📱 Impact of Social Media on Life — End-to-End Analytics & ML Suite

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Streamlit](https://img.shields.io/badge/UI-Streamlit-FF4B4B.svg)](https://streamlit.io/)

A complete, production-grade Machine Learning and Data Analytics system analyzing how digital screen time, late-night phone usage, and primary social media platforms impact student **academic performance (GPA)**, **sleep hygiene**, **perceived stress**, and **mental health**.

Based on Kaggle's [Impact of Social Media on Life](https://www.kaggle.com/datasets/harishyadav0506/impact-of-social-media-on-life) dataset (4,500 students, 16 features).

---

## 🌟 Key Highlights & Discoveries

1. **The Sleep Displacement Mechanism**: `Screen_to_Sleep_Ratio` (daily screen time relative to sleep duration) emerged as the single most dominant predictor of student GPA (importance: 48.6%) and Mental Health Index (importance: 80.4%).
2. **Late-Night Doomscrolling Impact**: Students engaging in screen usage right before bed experience a **~2.0 point drop** in Sleep Quality Score and an average GPA drop from 3.66 to 2.86 when screen time exceeds 10 hours.
3. **Class-Balanced Overall Impact Classifier**:
   - Accurately predicts student wellbeing impact (`Beneficial`, `Neutral`, `Negative`).
   - Achieves **96.2% overall accuracy** and **0.9225 Macro F1-score** using XGBoost with balanced loss weighting to counter extreme 82% class imbalance.
4. **Leak-Free Continuous Regressors**:
   - **Academic GPA Predictor**: Ridge Regression achieving Test RMSE of 0.2684 and $R^2 \approx 0.51$.
   - **Mental Health Index Predictor**: Ridge Regression achieving Test RMSE of 5.47 and $R^2 \approx 0.82$.
5. **Behavioral Archetypes (Unsupervised Phenotyping)**:
   - **Archetype 0 (50.2%)**: *Disciplined & High-Achieving Healthy Users* (Avg screen: 3.5h, sleep: 7.5h, GPA: 3.66).
   - **Archetype 1 (35.6%)**: *Moderate Habitual Browsers* (Avg screen: 6.0h, sleep: 6.3h, GPA: 3.33).
   - **Archetype 2 (14.2%)**: *High-Risk Sleep-Deprived Doomscrollers* (Avg screen: 10.1h, sleep: 4.9h, GPA: 2.86).

---

## 🏗️ Repository Architecture

```
effect-of-social-media/
├── data/
│   ├── raw/                      # Downloaded dataset (Social_media_impact_on_life.csv)
│   └── processed/                # Leak-free Train (3,600), Val (450), Test (450) splits
├── models/                       # Serialized pipelines and evaluation metrics JSONs
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
├── tests/
│   └── test_preprocessor.py      # Unittest suite validating zero data leakage
├── app.py                        # Interactive Streamlit Web Application
├── requirements.txt
└── README.md
```

---

## 🚀 Quickstart Guide

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/fauzinoorsyabani/effect-of-social-media.git
cd effect-of-social-media
pip install -r requirements.txt
```

### 2. Run the Modern Web Dashboard (HTML5 + Tailwind + FastAPI/Starlette)
Launch the modern, responsive web application (zero emojis, fluid live sliders, dark glassmorphism):
```bash
python server.py
```
Open your browser at **`http://localhost:8000`**.

*(Optional)* You can also run the Streamlit version:
```bash
python -m streamlit run app.py
```

### 3. Run Automated Tests
```bash
python -m unittest discover tests
```

### 4. Retrain Models
To retrain pipelines from scratch:
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

## 📊 Streamlit App Features

- **Tab 1: Population Insights & EDA**: Dynamic cohort slicing by academic level, platform, and bedtime habits with real-time KPI metrics and Plotly charts.
- **Tab 2: Digital Wellbeing & GPA Simulator**: Real-time multi-task AI simulation allowing students to input their screen and sleep habits to receive predicted GPA, stress risk, assigned persona archetype, and tailored advice.
- **Tab 3: Machine Learning & Explainability**: Model comparisons, confusion matrices, feature importance rankings, and 2D latent PCA cluster maps.
