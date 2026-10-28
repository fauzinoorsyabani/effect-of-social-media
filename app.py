"""PulseAI Application Entry Point for Hugging Face Spaces (Gradio SDK / ZeroGPU).

This entry point connects the Starlette ASGI production platform (serving the
minimalist React SPA, REST endpoints, and ML inference pipeline) with
Hugging Face's Gradio execution environment on port 7860.
"""
import os
import uvicorn
from server import app

try:
    import spaces
except ImportError:
    class spaces:
        @staticmethod
        def GPU(fn):
            return fn

try:
    import gradio as gr
    has_gradio = True
except ImportError:
    has_gradio = False


@spaces.GPU
def run_pulseai_diagnostic(prompt: str) -> str:
    """ZeroGPU compliance diagnostic handler."""
    return f"PulseAI Engine Online. Status: optimal. Input received: {prompt}"


if has_gradio:
    with gr.Blocks(title="PulseAI Diagnostic Engine") as demo:
        gr.Markdown(
            "# PulseAI Student Digital Wellness and Academic Impact Platform\n\n"
            "The production React interactive SPA is active at the application root: **`/`**.\n\n"
            "This diagnostic console serves as the fallback health check and API explorer."
        )
        with gr.Row():
            diagnostic_input = gr.Textbox(label="Diagnostic Signal", value="System Health Check")
            diagnostic_button = gr.Button("Execute Diagnostic")
        diagnostic_output = gr.Textbox(label="Diagnostic Telemetry")
        diagnostic_button.click(
            fn=run_pulseai_diagnostic,
            inputs=diagnostic_input,
            outputs=diagnostic_output
        )

    app = gr.mount_gradio_app(app, demo, path="/gradio")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"Starting PulseAI on http://{host}:{port} ...")
    uvicorn.run(app, host=host, port=port)
