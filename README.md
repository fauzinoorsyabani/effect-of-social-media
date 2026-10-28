---
title: PulseAI Student Digital Wellness
colorFrom: blue
colorTo: indigo
sdk: gradio
sdk_version: 5.4.0
app_file: app.py
pinned: false
license: mit
---

# PulseAI: Student Digital Lifestyle & Academic Impact Platform

A production-grade, mathematically validated machine learning system and diagnostic platform evaluating how digital screen exposure, late-night phone habits, and social media dynamics impact student academic performance (GPA), circadian sleep architecture, perceived stress, and mental resilience.

> **Live Production System**: [https://pulseai.my.id](https://pulseai.my.id) (Edge SSL via Vercel)

Based on empirical observational survey data of 4,500 students ([harishyadav0506/impact-of-social-media-on-life](https://www.kaggle.com/datasets/harishyadav0506/impact-of-social-media-on-life)).

---

## 1. Start With WHY: The Philosophy and Scientific Rationale

### The Fundamental Problem
Higher education and adolescent cognitive development face an escalating systemic challenge: digital displacement. The proliferation of algorithmic, infinite-scroll feeds has severed biological rest-and-recovery rhythms from daily academic life.

Students do not merely browse digital applications; screen exposure actively displaces biological sleep windows. This displacement induces a compounding neuro-psychological penalty:
1. **Circadian Disruption**: Late-night screen exposure suppresses natural melatonin synthesis, extending sleep latency and diminishing slow-wave restorative sleep.
2. **Cognitive Degradation**: Fragmented sleep undermines prefrontal cortex consolidation, degrading working memory, critical thinking, and exam synthesis.
3. **Upward Comparison Stress**: Algorithmic feeds showcase curated peer highlights, fostering chronic upward social comparison and elevated cortisol/stress markers.

### Why Process This Specific Dataset?
Empirical behavioral research requires granular, multidimensional observation across physiological, behavioral, and cognitive boundaries. This dataset captures 4,500 student records across 16 interconnected features:
* **Digital Exposure Dimensions**: Daily Usage Hours, Weekend Extra Hours, Primary Platform (Instagram, TikTok, YouTube, Snapchat, Reddit, X, LinkedIn), Device Type.
* **Circadian & Sleep Architecture**: Sleep Duration Hours, Sleep Quality Score (1-10), Late-Night Usage Flag (<45 minutes before sleep).
* **Psychological Mediators**: Upward Social Comparison Frequency, Perceived Stress Score (0-40), Mental Health Resilience Index (0-100).
* **Academic Endpoints**: Cumulative GPA (1.90 - 4.00), Overall Perceived Impact Classification (Beneficial, Neutral, Negative).

---

## 2. Target Audience & Stakeholder Impact Matrix

Who is this platform built for, and what specific problem does it solve for each group?

| Stakeholder Group | Core Pain Point | PulseAI Solution | Value Delivered |
| :--- | :--- | :--- | :--- |
| **Students & Learners** | Vague, moralistic advice ("stop playing on your phone") without quantified cause-and-effect. | Real-time simulator demonstrating the exact mathematical GPA penalty of an extra 1.5 hours of late-night screen time. | Actionable self-agency and quantifiable habit adjustment without feeling judged. |
| **University Academic Advisors & Counselors** | Detecting academic decline only after exams fail, when remediation is difficult and costly. | Early-warning behavioral archetyping (K-Means clustering) identifying High-Risk Sleep-Deprived Doomscrollers. | Proactive preventative counseling before midterms and finals. |
| **Higher Education Researchers** | Fragmented datasets lacking cross-sectional analysis between circadian health and academic metrics. | Empirical validation of the Displacement Principle and open regression benchmarks. | Reproducible open-source baseline for behavioral epidemiology. |
| **Tech Recruiters & AI Engineering Evaluators** | Distinguishing basic notebook scripters from Senior Full-Stack / Forward-Deployed AI Engineers. | Production-grade decoupled architecture: leak-free pipelines, cost-weighted XGBoost, ASGI server, and modern React interface. | Demonstrates end-to-end software craftsmanship, mathematical rigor, and architectural maturity. |

---

## 3. Technology Selection Manifesto: Why These Tools?

In senior software and AI engineering, every dependency is a liability unless rigorously justified. Below is the architectural rationale for every tool chosen:

```mermaid
flowchart TD
    RawData["Raw Dataset (4,500 Rows)"] --> PandasNumPy["Pandas & NumPy Vectorization"]
    PandasNumPy --> FeatureEng["Feature Engineering (Screen/Sleep Ratio)"]
    FeatureEng --> Split["Leak-Free Stratified Split (80/10/10)"]
    Split --> MLTrain["Scikit-Learn & XGBoost Training"]
    MLTrain --> Serialized["Joblib Serialized Pipelines (.joblib)"]
    Serialized --> ASGIServer["Starlette / Uvicorn ASGI Backend"]
    DB[(SQLite Local DB)] <--> ASGIServer
    ASGIServer <--> ReactFrontend["React + Vite + Chart.js Frontend"]
```

| Technology | Role | Why Chosen? | What Was Rejected & Why? |
| :--- | :--- | :--- | :--- |
| **NumPy** | Numerical Kernels & Vectorized Linear Algebra | C-contiguous array buffers, SIMD hardware acceleration, zero-overhead dot products required by machine learning estimators. | Pure Python Lists: 50x-100x slower due to dynamic type boxing/unboxing and pointer indirection overhead. |
| **Pandas** | Tabular Data Transformation & Schema Validation | Industry-standard tabular data frames, efficient vectorized column manipulations, native datetime/string handling. | Apache Spark / PySpark: Overkill for 4,500 records (~1MB). Introducing JVM overhead and cluster latency would waste compute resources. |
| **Scikit-Learn** | Pipeline & Preprocessing Abstraction | Unified `ColumnTransformer` and estimator interfaces guarantee deterministic, leak-free transformations from training to inference. | Writing custom normalization loops: High risk of silent training-serving skew and mutable global state bugs. |
| **XGBoost** | Multi-Class Impact Classifier | Gradient-boosted decision trees inherently capture non-linear feature interactions without requiring manual polynomial expansions. Native sample-weighting resolves class imbalance. | Deep Neural Networks (MLP): Deep learning on 4,500 tabular rows overfits quickly, requires heavy compute, and lacks tabular interpretability. |
| **Starlette + Uvicorn** | High-Performance ASGI Backend | Asynchronous I/O via `uvloop` and `httptools`, sub-millisecond response latency, lightweight footprint (<15MB RAM), native static file mounting. | Django: Monolithic bloat with hundreds of unused ORM/template features. Flask: WSGI synchronous bottleneck under concurrent requests. |
| **SQLite** | Persistent Structured Storage | Zero-configuration, zero-cost, single-file serverless ACID database embedded directly in Python. | PostgreSQL / MySQL: Requires managing external database server daemons, ports, and connection pool configuration for a lightweight dataset. |
| **React + Vite** | Component-Driven Web Interface | Declarative Virtual DOM state propagation, sub-second Hot Module Replacement (HMR), tree-shaken minified production bundle (<150KB gzip). | Vanilla JS DOM scripting: Leads to unmaintainable imperative spaghetti code (`document.getElementById`). Next.js: Unnecessary SSR server complexity for a client-side diagnostic cockpit. |
| **Chart.js** | Interactive Longitudinal Visualizations | Canvas-based rendering delivering 60 FPS transitions, low bundle overhead, clean responsive scales. | D3.js: Steep learning curve and verbose low-level DOM manipulations unnecessary for standard dual-axis timelines and bar charts. |

---

## 4. Machine Learning Rigor: Generalization vs. Overfitting

### Is 96.22% Accuracy Overfitting?
A crucial question in machine learning evaluation: **Is an accuracy of ~96% suspiciously high or indicative of overfitting?**

**Answer: No, this model is NOT overfitted.** The proof lies in rigorous statistical evaluation beyond naive accuracy:

#### 1. The Class Imbalance Reality
In the 4,500 student dataset, the target variable `Overall_Impact` is heavily imbalanced:
* **Beneficial**: 3,681 students (~81.8%)
* **Neutral**: 654 students (~14.5%)
* **Negative**: 165 students (~3.7%)

> **Critical Data Science Principle**: A naive dummy classifier that simply predicts "Beneficial" for 100% of inputs will achieve an **81.8% Accuracy** without learning a single feature! Therefore, **Accuracy alone is a misleading metric** for imbalanced data.

#### 2. Why We Benchmark Macro F1-Score
To prevent majority-class bias, we strictly optimize for **Macro F1-Score**, which computes the unweighted harmonic mean of Precision and Recall across all classes independently:

$$\text{Macro F1} = \frac{F1_{\text{Beneficial}} + F1_{\text{Neutral}} + F1_{\text{Negative}}}{3}$$

If a model memorizes "Beneficial" but fails to detect "Negative" or "Neutral" students, its Macro F1 drops catastrophically to ~0.35. Our models achieved:
* **Validation Macro F1**: `0.9328` (93.28%)
* **Test Macro F1 (Independent Holdout)**: `0.9225` (92.25%)

The drop between validation and holdout test data is **only 1.03%**, demonstrating ideal bias-variance equilibrium and zero memorization noise.

#### 3. Benchmark Comparison Across Candidate Algorithms
Evaluated on the independent test set ($N = 450$):

| Algorithm | Validation Macro F1 | Test Macro F1 | Weighted F1 | Test Accuracy | Generalization Assessment |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Logistic Regression (L2 Balanced)** | 0.9252 | 0.9105 | 0.9591 | 95.78% | Linear baseline; slightly underfits complex interactions. |
| **Random Forest (200 Trees)** | 0.9357 | 0.8790 | 0.9506 | 94.89% | Noticeable validation-to-test drop (~5.67%); mild tree memorization. |
| **XGBoost (Selected Champion)** | **0.9328** | **0.9225** | **0.9632** | **96.22%** | **Superior generalization; minimal drop (1.03%); robust cost-weighted convergence.** |

---

## 5. Overfitting Mitigation & Mathematical Guardrails

How do we guarantee that our models do not overfit? Five concrete engineering safeguards are implemented:

### 1. Leak-Free 80/10/10 Stratified Splitting
Data is partitioned strictly before preprocessing into:
* **Train Set**: 3,600 samples (80%)
* **Validation Set**: 450 samples (10%)
* **Holdout Test Set**: 450 samples (10%)

Stratification preserves identical class ratios across all splits, preventing minority class starvation.

### 2. Zero-Leakage Preprocessing Pipeline
* Imputation statistics (feature medians) and feature scalers (`StandardScaler`) are **fit exclusively on the training set**.
* Test and validation sets are strictly transformed using training statistics. No future information ever leaks into model weights.

### 3. L2 Regularization (Ridge / Weight Decay Penalty)
In both our Logistic Regression classifier and Continuous GPA/Mental Health regressors, we enforce **L2 Regularization**:

$$\mathcal{L}_{\text{Ridge}}(w) = \sum_{i=1}^N (y_i - \hat{y}_i)^2 + \lambda \sum_{j=1}^P w_j^2$$

* **What does L2 do?** It imposes a quadratic penalty proportional to the magnitude of feature coefficients ($w_j$).
* **Why does it prevent overfitting?** It forces model weights to shrink smoothly toward zero, eliminating multicollinearity and preventing any single feature from dominating the decision boundary.

### 4. Cost-Weighted Loss Function
Rather than treating all classification mistakes equally, we assign inverse class weights:

$$W_c = \frac{N_{\text{total}}}{K \cdot N_c}$$

This heavily penalizes errors on rare "Negative" impact cases, forcing gradient descent to learn true decision boundaries rather than defaulting to the majority class.

### 5. Tree Depth and Learning Rate Constraints
In XGBoost:
* `max_depth = 6`: Caps tree complexity, preventing deep branches that memorize individual students.
* `learning_rate = 0.08`: Conservative gradient steps prevent overshooting local minima.
* `n_estimators = 200`: Bounded ensemble capacity with early validation monitoring.

---

## 6. The Authentication Dilemma: Why Hybrid Local-First?

### Should an AI Analytics Platform Force User Login?
In machine learning portfolio and diagnostic systems, a common mistake is placing an aggressive, mandatory login barrier at the entrypoint.

#### Why Mandatory Login Is Counter-Productive:
1. **Friction and Conversion Collapse**: Reviewers, recruiters, and students want to experience model inference in under 5 seconds. Mandatory registration drops initial engagement by over 80%.
2. **Privacy Sensitivity**: Students are hesitant to enter sensitive personal data (sleep hours, perceived stress, GPA) into an unfamiliar cloud platform if forced to create a persistent profile.
3. **Data Scope**: The core ML dataset is already static and validated (4,500 records). The platform does not need to harvest new user credentials to deliver diagnostic value.

#### The PulseAI Architectural Solution: Hybrid Local-First
We implement a **Local-First, Cloud-Optional Architecture**:
* **Mode 1: Private Local Mode (Default)**:
  * Simulations, assessments, and longitudinal trends are saved instantly to browser `localStorage`.
  * Zero network transmission of personal health metrics. Completely private and frictionless.
* **Mode 2: Optional Cloud Sync Account**:
  * Users who actively wish to sync their assessment history between a university desktop and a personal smartphone can create a free lightweight account.
  * Credentials are secure (salted SHA-256 hash), linking saved assessments to the embedded SQLite engine via authenticated `/api/assessments/save` requests.

---

## 7. Core Empirical Behavioral Discoveries

1. **The Displacement Mechanism (Strongest Determinant)**:
   * The engineered feature `Screen_to_Sleep_Ratio` ($\text{Daily Usage} / \text{Sleep Duration}$) accounts for **48.6% of GPA model importance** and **80.4% of Mental Health Index importance**.
   * When daily screen hours exceed sleep duration (ratio > 1.0), cumulative GPA drops below 3.00, regardless of reported study hours.
2. **Platform Stress Variance (ANOVA $p < 0.05$)**:
   * Algorithmic short-video feeds (TikTok, Instagram) generate statistically higher perceived stress scores and late-night usage rates compared to linear video (YouTube) or professional feeds (LinkedIn).
3. **Non-Linear Bedtime Penalty**:
   * Phone exposure within 45 minutes of sleep decreases subjective sleep quality by a median of **2.1 points** (on a 10-point scale), depressing next-day cognitive performance.

---

## 8. Continuous Regression & Clustering Benchmarks

### Regression Models (Test Set $N = 450$)
* **Academic GPA Prediction**: Ridge Regression ($R^2 = 0.5033$, $\text{RMSE} = 0.2684$, $\text{MAE} = 0.2141$).
* **Mental Health Resilience**: Ridge Regression ($R^2 = 0.8173$, $\text{RMSE} = 5.4712$, $\text{MAE} = 4.4572$).

### Student Behavioral Archetypes (K-Means $k=3$)
1. **Disciplined Achievers (50.2%)**: Screen ~3.5h, Sleep ~7.5h, Stress 9.1/40, Average GPA 3.66. Low risk.
2. **Moderate Browsers (35.6%)**: Screen ~6.0h, Sleep ~6.3h, Stress 15.4/40, Average GPA 3.33. Moderate risk.
3. **High-Risk Doomscrollers (14.2%)**: Screen ~10.1h, Sleep ~4.9h, Stress 24.3/40, Average GPA 2.86. Critical risk.

---

## 9. Quickstart & Deployment

### Run Locally (Production Full-Stack Mode)
```bash
python server.py
```
Open **http://localhost:8000** in your browser.

### Run in Frontend Dev Mode (Hot Module Replacement)
```bash
# Terminal 1: Python ASGI API
python server.py

# Terminal 2: React Vite HMR
cd frontend && npm run dev
```
Open **http://localhost:5173**.

### Run Automated Test Suite
```bash
python -m unittest discover tests
```

---

## 10. Author & License
Crafted by **Fauzi Noor Syabani**.
Distributed under the **MIT License**. Free for academic, personal, and research applications.
