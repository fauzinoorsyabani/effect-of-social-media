"""PulseAI Application Entry Point for Hugging Face Spaces (Gradio SDK).

This entry point connects the Starlette ASGI production platform (serving the
minimalist React SPA, REST endpoints, and ML inference pipeline) with
Hugging Face's Gradio execution environment on port 7860.
"""
import os
import uvicorn
from server import app

# Optional Gradio mount to satisfy Hugging Face Space auto-detection while preserving React root
try:
    import gradio as gr

    with gr.Blocks(title="PulseAI Diagnostic Engine") as demo:
        gr.Markdown(
            "# PulseAI Student Digital Wellness and Academic Impact Platform\n\n"
            "The production React interactive SPA is active at the application root: **`/`**.\n\n"
            "This diagnostic console serves as the fallback health check and API explorer."
        )

    app = gr.mount_gradio_app(app, demo, path="/gradio")
except Exception as err:
    print(f"Gradio mounting deferred: {err}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"Starting PulseAI on http://{host}:{port} ...")
    uvicorn.run(app, host=host, port=port)
