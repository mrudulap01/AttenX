@echo off
echo Installing Python Virtual Environment for AttenX AI Service...
cd ai-service
python -m venv venv
call venv\Scripts\activate.bat
echo Installing dependencies...
pip install -r requirements.txt
echo Downloading Pretrained Models...
python download_models.py
echo Installation Complete! Run 'venv\Scripts\activate' then 'uvicorn app.main:app' to start.
