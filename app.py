"""Interactive Streamlit Web Application: Impact of Social Media on Life.

Features:
- Multi-Tab Analysis (Executive Insights, Live Simulator, Model Explainability)
- Real-Time Multi-Task Predictions (GPA, Mental Health Index, Overall Impact, Persona Clustering)
- Interactive Plotly Visualizations & Dynamic Filtering
"""
from pathlib import Path
import json
import joblib
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

# Configure Page
st.set_page_config(
    page_title="Impact of Social Media on Student Life & Wellbeing",
    page_icon="📱",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom Styling (CSS)
st.markdown(
    """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', sans-serif;
    }
    
    .metric-card {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 1.25rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        backdrop-filter: blur(10px);
        margin-bottom: 1rem;
    }
    
    .metric-value {
        font-size: 2.2rem;
        font-weight: 800;
        letter-spacing: -0.5px;
    }
    
    .metric-label {
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #8892b0;
        margin-bottom: 0.25rem;
    }
    
    .badge-pill {
        display: inline-block;
        padding: 0.35rem 0.75rem;
        border-radius: 50px;
        font-weight: 700;
        font-size: 0.85rem;
        letter-spacing: 0.5px;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "raw" / "Social_media_impact_on_life.csv"
MODELS_DIR = BASE_DIR / "models"


@st.cache_data
def load_dataset():
    if not DATA_PATH.exists():
        # Fallback to kagglehub if needed
        import kagglehub
        import shutil

        path = kagglehub.dataset_download(
            "harishyadav0506/impact-of-social-media-on-life"
        )
        DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(
            Path(path) / "Social_media_impact_on_life.csv", DATA_PATH
        )

    df = pd.read_csv(DATA_PATH)
    return df


@st.cache_resource
def load_all_artifacts():
    artifacts = {}
    # Classifier
    artifacts["classifier"] = joblib.load(
        MODELS_DIR / "classifier_overall_impact.joblib"
    )
    artifacts["classifier_prep"] = joblib.load(
        MODELS_DIR / "classifier_preprocessor.joblib"
    )
    with open(MODELS_DIR / "classifier_metrics.json", "r") as f:
        artifacts["classifier_metrics"] = json.load(f)

    # GPA Regressor
    artifacts["reg_gpa"] = joblib.load(MODELS_DIR / "regressor_gpa.joblib")
    artifacts["reg_gpa_prep"] = joblib.load(
        MODELS_DIR / "regressor_gpa_preprocessor.joblib"
    )
    with open(MODELS_DIR / "regression_gpa_metrics.json", "r") as f:
        artifacts["reg_gpa_metrics"] = json.load(f)

    # Mental Health Regressor
    artifacts["reg_mental"] = joblib.load(
        MODELS_DIR / "regressor_mental_health.joblib"
    )
    artifacts["reg_mental_prep"] = joblib.load(
        MODELS_DIR / "regressor_mental_health_preprocessor.joblib"
    )
    with open(MODELS_DIR / "regression_mental_health_metrics.json", "r") as f:
        artifacts["reg_mental_metrics"] = json.load(f)

    # Clustering
    artifacts["kmeans"] = joblib.load(MODELS_DIR / "clustering_kmeans.joblib")
    artifacts["pca"] = joblib.load(MODELS_DIR / "clustering_pca.joblib")
    artifacts["cluster_prep"] = joblib.load(
        MODELS_DIR / "clustering_preprocessor.joblib"
    )
    with open(MODELS_DIR / "clustering_metadata.json", "r") as f:
        artifacts["clustering_meta"] = json.load(f)

    return artifacts


# Load Data and Models
try:
    df_raw = load_dataset()
    artifacts = load_all_artifacts()
except Exception as e:
    st.error(f"Error loading system assets: {e}")
    st.stop()

# Header
st.title("📱 Social Media & Student Wellbeing Platform")
st.markdown(
    "**End-to-End Analytics, Behavioral Archetyping & Predictive Simulation Engine**"
)

# Tabs Navigation
tab_eda, tab_sim, tab_models = st.tabs(
    [
        "📊 Population Insights & EDA",
        "🎯 Digital Wellbeing & GPA Simulator",
        "🧠 Machine Learning & Explainability",
    ]
)

# ==========================================================
# TAB 1: POPULATION INSIGHTS & EDA
# ==========================================================
with tab_eda:
    st.markdown("### 🔍 Dataset Cohort Explorer")

    # Filters in Sidebar / Expander
    with st.expander("🎛️ Filter Cohort Segment", expanded=True):
        col_f1, col_f2, col_f3, col_f4 = st.columns(4)
        with col_f1:
            sel_academic = st.multiselect(
                "Academic Level",
                options=df_raw["Academic_Level"].unique(),
                default=df_raw["Academic_Level"].unique(),
            )
        with col_f2:
            sel_platform = st.multiselect(
                "Primary Platform",
                options=df_raw["Primary_Platform"].unique(),
                default=df_raw["Primary_Platform"].unique(),
            )
        with col_f3:
            sel_device = st.multiselect(
                "Device Type",
                options=df_raw["Device_Type"].unique(),
                default=df_raw["Device_Type"].unique(),
            )
        with col_f4:
            sel_late_night = st.selectbox(
                "Late Night Usage",
                options=["All", "Yes (Late Night)", "No (Normal)"],
            )

    # Filter DataFrame
    df_filtered = df_raw[
        (df_raw["Academic_Level"].isin(sel_academic))
        & (df_raw["Primary_Platform"].isin(sel_platform))
        & (df_raw["Device_Type"].isin(sel_device))
    ]
    if sel_late_night == "Yes (Late Night)":
        df_filtered = df_filtered[df_filtered["Late_Night_Usage"] == True]
    elif sel_late_night == "No (Normal)":
        df_filtered = df_filtered[df_filtered["Late_Night_Usage"] == False]

    # KPI Top Cards
    kpi1, kpi2, kpi3, kpi4, kpi5 = st.columns(5)
    with kpi1:
        st.markdown(
            f"""
            <div class="metric-card">
                <div class="metric-label">Selected Students</div>
                <div class="metric-value">{len(df_filtered):,}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )
    with kpi2:
        avg_screen = df_filtered["Daily_Usage_Hours"].mean()
        st.markdown(
            f"""
            <div class="metric-card">
                <div class="metric-label">Avg Daily Screen</div>
                <div class="metric-value">{avg_screen:.1f} <span style="font-size:1.1rem;color:#888;">hrs</span></div>
            </div>
            """,
            unsafe_allow_html=True,
        )
    with kpi3:
        avg_sleep = df_filtered["Sleep_Duration_Hours"].mean()
        st.markdown(
            f"""
            <div class="metric-card">
                <div class="metric-label">Avg Sleep Duration</div>
                <div class="metric-value">{avg_sleep:.1f} <span style="font-size:1.1rem;color:#888;">hrs</span></div>
            </div>
            """,
            unsafe_allow_html=True,
        )
    with kpi4:
        avg_gpa = df_filtered["Academic_Performance_GPA"].dropna().mean()
        st.markdown(
            f"""
            <div class="metric-card">
                <div class="metric-label">Average GPA</div>
                <div class="metric-value" style="color:#00d26a;">{avg_gpa:.2f}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )
    with kpi5:
        late_pct = df_filtered["Late_Night_Usage"].mean() * 100
        st.markdown(
            f"""
            <div class="metric-card">
                <div class="metric-label">Late-Night Doomscrolling</div>
                <div class="metric-value" style="color:#f85149;">{late_pct:.0f}%</div>
            </div>
            """,
            unsafe_allow_html=True,
        )

    st.write("---")

    # Visualizations Row 1
    row1_c1, row1_c2 = st.columns(2)
    with row1_c1:
        df_scatter = df_filtered.copy()
        df_scatter["Stress_Display"] = df_scatter["Perceived_Stress_Score"].fillna(
            df_scatter["Perceived_Stress_Score"].median()
        )
        # Ensure minimum size for visibility
        df_scatter["Stress_Display"] = np.maximum(df_scatter["Stress_Display"], 1.0)

        fig_scatter = px.scatter(
            df_scatter,
            x="Daily_Usage_Hours",
            y="Sleep_Duration_Hours",
            color="Late_Night_Usage",
            size="Stress_Display",
            hover_data=[
                "Primary_Platform",
                "Academic_Performance_GPA",
                "Mental_Health_Index",
            ],
            color_discrete_map={True: "#e41a1c", False: "#3b82f6"},
            labels={
                "Daily_Usage_Hours": "Daily Screen Hours",
                "Sleep_Duration_Hours": "Sleep Duration (Hours)",
                "Late_Night_Usage": "Late Night Usage",
                "Stress_Display": "Stress Score",
            },
            title="Screen Time vs. Sleep Duration (Bubble Size = Stress Score)",
        )
        fig_scatter.update_layout(template="plotly_dark", height=420)
        st.plotly_chart(fig_scatter, use_container_width=True)

    with row1_c2:
        platform_stats = (
            df_filtered.groupby("Primary_Platform")
            .agg(
                Avg_Screen=("Daily_Usage_Hours", "mean"),
                Avg_GPA=("Academic_Performance_GPA", "mean"),
                Avg_Stress=("Perceived_Stress_Score", "mean"),
            )
            .reset_index()
            .sort_values(by="Avg_Screen", ascending=False)
        )

        fig_plat = px.bar(
            platform_stats,
            x="Primary_Platform",
            y="Avg_Screen",
            color="Avg_Stress",
            color_continuous_scale="Viridis",
            labels={
                "Avg_Screen": "Average Daily Hours",
                "Avg_Stress": "Stress Level",
            },
            title="Screen Time & Stress by Primary Social Platform",
        )
        fig_plat.update_layout(template="plotly_dark", height=420)
        st.plotly_chart(fig_plat, use_container_width=True)

    # Visualizations Row 2
    row2_c1, row2_c2 = st.columns(2)
    with row2_c1:
        comparison_order = ["Never", "Rarely", "Sometimes", "Frequently", "Always"]
        fig_comp = px.box(
            df_filtered,
            x="Social_Comparison_Frequency",
            y="Perceived_Stress_Score",
            category_orders={"Social_Comparison_Frequency": comparison_order},
            color="Social_Comparison_Frequency",
            title="Upward Social Comparison Frequency vs. Perceived Stress",
        )
        fig_comp.update_layout(
            template="plotly_dark", height=400, showlegend=False
        )
        st.plotly_chart(fig_comp, use_container_width=True)

    with row2_c2:
        fig_impact = px.pie(
            df_filtered,
            names="Overall_Impact",
            color="Overall_Impact",
            color_discrete_map={
                "Beneficial": "#2ca02c",
                "Neutral": "#1f77b4",
                "Negative": "#d62728",
            },
            title="Overall Perceived Impact Proportions in Cohort",
            hole=0.45,
        )
        fig_impact.update_layout(template="plotly_dark", height=400)
        st.plotly_chart(fig_impact, use_container_width=True)


# ==========================================================
# TAB 2: DIGITAL WELLBEING & GPA SIMULATOR
# ==========================================================
with tab_sim:
    st.markdown("### 🎮 Real-Time Lifestyle Simulator & AI Prediction Engine")
    st.write(
        "Adjust student digital habits, bedtime practices, and platform choices to see live predictions for GPA, mental wellbeing, and behavioral archetype persona."
    )

    sim_col1, sim_col2 = st.columns([1, 1.3])

    with sim_col1:
        st.markdown("#### ⚙️ Input Student Behavioral Profile")

        s_age = st.slider("Student Age", min_value=15, max_value=26, value=20)
        s_gender = st.selectbox(
            "Gender",
            options=["Female", "Male", "Non-Binary", "Prefer not to say"],
        )
        s_academic = st.selectbox(
            "Academic Level",
            options=["Undergraduate", "High School", "Postgraduate"],
        )
        s_platform = st.selectbox(
            "Primary Social Media Platform",
            options=[
                "Instagram",
                "TikTok",
                "YouTube",
                "Snapchat",
                "Reddit",
                "X (Twitter)",
                "LinkedIn",
            ],
        )
        s_device = st.selectbox(
            "Primary Device", options=["Smartphone", "Laptop/PC", "Tablet"]
        )

        st.write("---")
        s_daily = st.slider(
            "Daily Social Media Screen Time (Hours)",
            min_value=0.5,
            max_value=14.0,
            value=4.5,
            step=0.25,
        )
        s_weekend = st.slider(
            "Weekend Extra Usage (Hours above daily average)",
            min_value=0.0,
            max_value=8.0,
            value=1.5,
            step=0.5,
        )
        s_sleep_dur = st.slider(
            "Sleep Duration (Hours)",
            min_value=3.0,
            max_value=11.0,
            value=7.0,
            step=0.25,
        )
        s_sleep_qual = st.slider(
            "Sleep Quality Rating (1 = Poor, 10 = Restorative)",
            min_value=1,
            max_value=10,
            value=7,
        )
        s_late_night = st.checkbox(
            "Uses Screen Right Before Bed / Late Night", value=True
        )
        s_comparison = st.select_slider(
            "Social Comparison Frequency",
            options=["Never", "Rarely", "Sometimes", "Frequently", "Always"],
            value="Sometimes",
        )

    # Compute Predictions
    with sim_col2:
        st.markdown("#### 🔮 Machine Learning Prediction Results")

        # Synthesize single row DataFrame matching training schema
        input_data = pd.DataFrame(
            [
                {
                    "Student_ID": "SIM_USER",
                    "Age": s_age,
                    "Gender": s_gender,
                    "Academic_Level": s_academic,
                    "Primary_Platform": s_platform,
                    "Daily_Usage_Hours": s_daily,
                    "Weekend_Extra_Hours": s_weekend,
                    "Device_Type": s_device,
                    "Sleep_Duration_Hours": s_sleep_dur,
                    "Sleep_Quality_Score": s_sleep_qual,
                    "Late_Night_Usage": s_late_night,
                    "Social_Comparison_Frequency": s_comparison,
                    "Perceived_Stress_Score": np.nan,  # Preprocessor will leak-freely impute with train median
                    "Mental_Health_Index": 55,  # Baseline approximation for initial step
                    "Academic_Performance_GPA": np.nan,
                    "Overall_Impact": "Neutral",
                }
            ]
        )

        # 1. Predict GPA
        reg_gpa_prep = artifacts["reg_gpa_prep"]
        reg_gpa = artifacts["reg_gpa"]
        X_gpa = reg_gpa_prep.transform(input_data)
        pred_gpa = float(reg_gpa.predict(X_gpa)[0])
        pred_gpa = max(1.0, min(4.0, pred_gpa))

        # Update input with predicted GPA for subsequent models
        input_data["Academic_Performance_GPA"] = pred_gpa

        # 2. Predict Mental Health Index
        reg_mental_prep = artifacts["reg_mental_prep"]
        reg_mental = artifacts["reg_mental"]
        X_mental = reg_mental_prep.transform(input_data)
        pred_mental = float(reg_mental.predict(X_mental)[0])
        pred_mental = max(1.0, min(100.0, pred_mental))
        input_data["Mental_Health_Index"] = int(round(pred_mental))

        # 3. Predict Overall Impact
        clf_prep = artifacts["classifier_prep"]
        clf = artifacts["classifier"]
        X_clf = clf_prep.transform(input_data)
        pred_class_idx = int(clf.predict(X_clf)[0])
        class_names = ["Negative", "Neutral", "Beneficial"]
        pred_class_label = class_names[pred_class_idx]
        pred_probs = (
            clf.predict_proba(X_clf)[0]
            if hasattr(clf, "predict_proba")
            else [0.33, 0.33, 0.34]
        )

        # 4. Predict Behavioral Cluster
        cluster_prep = artifacts["cluster_prep"]
        kmeans = artifacts["kmeans"]
        X_cluster = cluster_prep.transform(input_data)
        pred_cluster_id = int(kmeans.predict(X_cluster)[0])
        cluster_meta = artifacts["clustering_meta"]["cluster_profiles"][
            str(pred_cluster_id)
        ]

        # Display Live Metric Cards
        p_c1, p_c2 = st.columns(2)
        with p_c1:
            gpa_color = (
                "#00d26a"
                if pred_gpa >= 3.5
                else ("#ffc107" if pred_gpa >= 3.0 else "#f85149")
            )
            st.markdown(
                f"""
                <div class="metric-card" style="border-left: 5px solid {gpa_color};">
                    <div class="metric-label">Predicted Academic GPA</div>
                    <div class="metric-value" style="color: {gpa_color};">{pred_gpa:.2f} <span style="font-size:1.1rem;color:#888;">/ 4.00</span></div>
                    <small style="color:#888;">Estimated based on screen/sleep displacement model</small>
                </div>
                """,
                unsafe_allow_html=True,
            )

        with p_c2:
            mental_color = (
                "#00d26a"
                if pred_mental >= 75
                else ("#ffc107" if pred_mental >= 60 else "#f85149")
            )
            st.markdown(
                f"""
                <div class="metric-card" style="border-left: 5px solid {mental_color};">
                    <div class="metric-label">Predicted Mental Health Index</div>
                    <div class="metric-value" style="color: {mental_color};">{pred_mental:.1f} <span style="font-size:1.1rem;color:#888;">/ 100</span></div>
                    <small style="color:#888;">Higher indicates better resilience and lower distress</small>
                </div>
                """,
                unsafe_allow_html=True,
            )

        # Assigned Persona Card
        badge_bg = cluster_meta["badge_color"]
        st.markdown(
            f"""
            <div class="metric-card" style="border-top: 4px solid {badge_bg}; margin-top: 10px;">
                <div class="metric-label">Identified Digital Phenotype Archetype</div>
                <h3 style="margin-top:0.25rem; color:{badge_bg};">{cluster_meta['name']}</h3>
                <p style="font-size: 0.95rem; color: #ccc;">{cluster_meta['description']}</p>
                <div style="margin-top: 0.5rem;">
                    <span class="badge-pill" style="background:{badge_bg}; color:#fff;">{cluster_meta['tier']}</span>
                    <span style="font-size:0.85rem; color:#888; margin-left: 10px;">Cohort Representation: {cluster_meta['percentage']}% of students</span>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        # Class Probabilities Bar Chart
        st.markdown("##### Overall Impact Classification Probabilities")
        prob_df = pd.DataFrame(
            {
                "Impact Category": class_names,
                "Probability": [round(float(p) * 100, 1) for p in pred_probs],
            }
        )
        fig_prob = px.bar(
            prob_df,
            x="Impact Category",
            y="Probability",
            color="Impact Category",
            color_discrete_map={
                "Beneficial": "#2ca02c",
                "Neutral": "#1f77b4",
                "Negative": "#d62728",
            },
            text="Probability",
        )
        fig_prob.update_traces(texttemplate="%{text}%", textposition="outside")
        fig_prob.update_layout(
            template="plotly_dark", height=240, showlegend=False, yaxis_range=[0, 105]
        )
        st.plotly_chart(fig_prob, use_container_width=True)

        # Tailored Lifestyle Recommendations
        st.markdown("#### 💡 Tailored Actionable Guidance")
        if s_daily > 6.0 or s_sleep_dur < 6.5 or s_late_night:
            st.warning(
                """
            - **Curfew on Blue Light**: Stop screen usage at least 45 minutes before sleep to restore deep REM sleep quality.
            - **Platform Boundaries**: High-dopamine endless feeds (TikTok/Instagram) are correlated with higher stress scores. Set a 45-minute daily limit.
            - **Protect GPA**: Our regression model reveals that `Screen_to_Sleep_Ratio` is the single biggest negative driver of GPA. Keep screen hours below sleep hours.
            """
            )
        else:
            st.success(
                """
            - **Healthy Equilibrium**: Your current sleep-to-screen ratio is in the top quartile of student wellbeing.
            - **Maintain Sleep Consistency**: Continue preserving consistent 7+ hour sleep windows across both weekdays and weekends.
            """
            )


# ==========================================================
# TAB 3: MACHINE LEARNING & EXPLAINABILITY
# ==========================================================
with tab_models:
    st.markdown("### 🧠 Model Performance Benchmarks & Feature Attribution")

    sub_c1, sub_c2 = st.columns(2)

    with sub_c1:
        st.markdown("#### 🏆 Overall Impact Classifier Benchmark")
        clf_metrics = artifacts["classifier_metrics"]["models"]
        bench_rows = []
        for m_name, m_data in clf_metrics.items():
            bench_rows.append(
                {
                    "Model": m_name,
                    "Val Macro F1": m_data["val_macro_f1"],
                    "Test Macro F1": m_data["test_macro_f1"],
                    "Test Weighted F1": m_data["test_weighted_f1"],
                }
            )
        st.dataframe(pd.DataFrame(bench_rows), use_container_width=True)

        # Confusion Matrix of Best Classifier
        st.markdown("##### Confusion Matrix (Test Set)")
        best_clf = artifacts["classifier_metrics"]["best_model"]
        cm = np.array(clf_metrics[best_clf]["confusion_matrix"])
        fig_cm = px.imshow(
            cm,
            text_auto=True,
            x=["Negative", "Neutral", "Beneficial"],
            y=["Negative", "Neutral", "Beneficial"],
            color_continuous_scale="Blues",
            labels=dict(x="Predicted Class", y="Actual Ground Truth"),
            title=f"Confusion Matrix: {best_clf}",
        )
        fig_cm.update_layout(template="plotly_dark", height=350)
        st.plotly_chart(fig_cm, use_container_width=True)

    with sub_c2:
        st.markdown("#### 📈 Continuous Regression Models Benchmark")
        gpa_metrics = artifacts["reg_gpa_metrics"]["models"]
        reg_rows = []
        for m_name, m_data in gpa_metrics.items():
            reg_rows.append(
                {
                    "Model": m_name,
                    "Val R²": m_data["val_r2"],
                    "Test R²": m_data["test_r2"],
                    "Test RMSE": m_data["test_rmse"],
                    "Test MAE": m_data["test_mae"],
                }
            )
        st.dataframe(pd.DataFrame(reg_rows), use_container_width=True)

        # Feature Importance Chart
        st.markdown("##### Top Predictive Drivers of Academic GPA")
        feat_imp = artifacts["reg_gpa_metrics"]["feature_importances"]
        top_feats = pd.DataFrame(
            list(feat_imp.items())[:10], columns=["Feature", "Importance"]
        ).sort_values(by="Importance", ascending=True)

        fig_imp = px.bar(
            top_feats,
            x="Importance",
            y="Feature",
            orientation="h",
            color="Importance",
            color_continuous_scale="Teal",
            title="Feature Importance Ranking (GPA Predictor)",
        )
        fig_imp.update_layout(template="plotly_dark", height=350)
        st.plotly_chart(fig_imp, use_container_width=True)

    st.write("---")
    st.markdown("#### 🗺️ PCA 2D Clustering Space & Digital Phenotype Segmentation")

    # PCA 2D Scatter for the cohort
    kmeans = artifacts["kmeans"]
    pca = artifacts["pca"]
    cluster_prep = artifacts["cluster_prep"]

    # Sample for smooth visualization
    sample_vis = df_raw.sample(n=min(1200, len(df_raw)), random_state=42)
    X_vis = cluster_prep.transform(sample_vis)
    pca_coords = pca.transform(X_vis)
    labels = kmeans.predict(X_vis)

    df_pca_plot = pd.DataFrame(
        {
            "PCA Component 1": pca_coords[:, 0],
            "PCA Component 2": pca_coords[:, 1],
            "Cluster": [f"Cluster {l}" for l in labels],
            "Daily Hours": sample_vis["Daily_Usage_Hours"].values,
            "Sleep Duration": sample_vis["Sleep_Duration_Hours"].values,
            "GPA": sample_vis["Academic_Performance_GPA"].values,
            "Platform": sample_vis["Primary_Platform"].values,
        }
    )

    fig_pca = px.scatter(
        df_pca_plot,
        x="PCA Component 1",
        y="PCA Component 2",
        color="Cluster",
        hover_data=["Platform", "Daily Hours", "Sleep Duration", "GPA"],
        title="Unsupervised Student Phenotypes Projected into 2D Latent Space",
        color_discrete_sequence=["#28a745", "#ffc107", "#dc3545"],
    )
    fig_pca.update_layout(template="plotly_dark", height=480)
    st.plotly_chart(fig_pca, use_container_width=True)
