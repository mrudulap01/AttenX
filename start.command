#!/bin/bash
echo "Installing Python Virtual Environment for AttenX AI Service (macOS)..."
cd ai-service
python3 -m venv venv
source venv/bin/activate
echo "Installing dependencies..."
pip install -r requirements.txt
echo "Downloading Pretrained Models..."
python3 download_models.py
echo "Installation Complete! Run 'source venv/bin/activate' then 'uvicorn app.main:app' to start."
