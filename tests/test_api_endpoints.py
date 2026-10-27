"""Integration test suite for PulseAI REST API endpoints."""
import unittest
import urllib.request
import json

BASE = "http://127.0.0.1:8000"


class TestPulseAIEndpoints(unittest.TestCase):
    def request(self, path, method="GET", data=None):
        url = f"{BASE}{path}"
        req = urllib.request.Request(url, method=method)
        if data:
            req.add_header("Content-Type", "application/json")
            body = json.dumps(data).encode("utf-8")
        else:
            body = None
        with urllib.request.urlopen(req, data=body, timeout=5) as res:
            content = res.read().decode("utf-8")
            is_json = "application/json" in res.headers.get("Content-Type", "")
            return res.status, (json.loads(content) if is_json else content)

    def test_01_root_page(self):
        status, html = self.request("/")
        self.assertEqual(status, 200)
        self.assertIn("<!doctype html>", html.lower())
        self.assertIn("PulseAI", html)

    def test_02_overview(self):
        status, data = self.request("/api/overview")
        self.assertEqual(status, 200)
        self.assertEqual(data["total_students"], 4500)
        self.assertIn("platform_breakdown", data)
        self.assertIn("impact_distribution", data)

    def test_03_models_metadata(self):
        status, data = self.request("/api/models")
        self.assertEqual(status, 200)
        self.assertIn("classifier", data)
        self.assertIn("regression_gpa", data)
        self.assertIn("regression_mental", data)
        self.assertIn("clustering", data)

    def test_04_predict(self):
        payload = {
            "age": 21,
            "gender": "Female",
            "academic_level": "Undergraduate",
            "primary_platform": "Instagram",
            "daily_usage_hours": 4.5,
            "weekend_extra_hours": 1.5,
            "device_type": "Smartphone",
            "sleep_duration_hours": 7.0,
            "sleep_quality_score": 8.0,
            "phone_before_sleep": False,
            "social_comparison_freq": "Sometimes",
        }
        status, data = self.request("/api/predict", method="POST", data=payload)
        self.assertEqual(status, 200)
        self.assertTrue(data.get("success"))
        preds = data["predictions"]
        self.assertIn("gpa", preds)
        self.assertIn("mental_health_index", preds)
        self.assertIn("archetype", preds)
        self.assertTrue(1.0 <= preds["gpa"] <= 4.0)
        self.assertTrue(0 <= preds["mental_health_index"] <= 100)

    def test_05_save_and_history(self):
        payload = {
            "user_id": "test_device_anon_1",
            "inputs": {
                "daily_usage_hours": 3.0,
                "sleep_duration_hours": 7.5,
                "sleep_quality_score": 8.0,
                "primary_platform": "YouTube",
            },
            "predictions": {
                "gpa": 3.65,
                "mental_health_index": 85.0,
                "overall_impact": "Beneficial",
                "archetype": {
                    "name": "Disciplined & High-Achieving Healthy Users",
                },
                "guidance": [{"title": "Healthy Routine", "message": "Keep consistent sleep intervals."}],
            },
        }
        status, save_res = self.request("/api/assessments/save", method="POST", data=payload)
        self.assertEqual(status, 200)
        self.assertTrue(save_res.get("success"))
        self.assertIn("assessment_id", save_res)

        # Fetch history
        status, hist_res = self.request("/api/assessments/history?user_id=test_device_anon_1")
        self.assertEqual(status, 200)
        self.assertTrue(hist_res.get("success"))
        self.assertGreaterEqual(len(hist_res["history"]), 1)

    def test_06_brand_assets(self):
        # Favicon WebP
        req = urllib.request.Request(f"{BASE}/favicon.webp")
        with urllib.request.urlopen(req, timeout=5) as res:
            self.assertEqual(res.status, 200)
            self.assertIn("image/webp", res.headers.get("Content-Type", ""))
            data = res.read()
            self.assertGreater(len(data), 1000)

        # Logo WebP
        req = urllib.request.Request(f"{BASE}/logo.webp")
        with urllib.request.urlopen(req, timeout=5) as res:
            self.assertEqual(res.status, 200)
            self.assertIn("image/webp", res.headers.get("Content-Type", ""))
            data = res.read()
            self.assertGreater(len(data), 10000)


if __name__ == "__main__":
    unittest.main()

