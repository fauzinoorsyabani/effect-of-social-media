FROM python:3.11-slim

# Create non-root user required by Hugging Face Spaces (UID 1000)
RUN useradd -m -u 1000 user

ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    PORT=7860 \
    HOST=0.0.0.0

WORKDIR $HOME/app

# Install dependencies first for Docker caching
COPY --chown=user:user requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Copy all application files
COPY --chown=user:user . .

# Hugging Face Spaces exposes port 7860 by default
EXPOSE 7860

USER user

CMD ["python", "server.py"]
