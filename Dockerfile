# Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

# Use Python slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Pull patched OS packages (openssl, etc.) from Debian's repo. The base image
# ships whatever was current when its tag was built, so it lags behind security fixes.
RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for Docker cache efficiency)
COPY requirements.txt .

# Patch pip, wheel, and setuptools from the base image to clear scan findings.
# setuptools stays below 82 so pkg_resources is still there for gunicorn.
RUN pip install --no-cache-dir --upgrade "pip>=26.1" "setuptools>=80.10.1,<82" "wheel>=0.46.2"

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY app.py .
COPY static/ static/

# Expose port
EXPOSE 8000

# Run with gunicorn (production server)
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app:app"]
