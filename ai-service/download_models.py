import os
import requests

MODELS_DIR = "models"
BUFFALO_URL = "https://github.com/deepinsight/insightface/releases/download/v0.7/buffalo_l.zip"
ANTISPOOF_URL = "https://github.com/minivision-ai/Silent-Face-Anti-Spoofing/raw/master/models/anti_spoof_models/2.7_80x80_MiniFASNetV2.pth"

def download_file(url, dest):
    if os.path.exists(dest):
        print(f"File {dest} already exists.")
        return
    print(f"Downloading {url} to {dest}...")
    response = requests.get(url, stream=True)
    response.raise_for_status()
    with open(dest, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    print(f"Download complete: {dest}")

if __name__ == "__main__":
    os.makedirs(MODELS_DIR, exist_ok=True)
    download_file(BUFFALO_URL, os.path.join(MODELS_DIR, "buffalo_l.zip"))
    
    # Normally, you would extract buffalo_l.zip to ~/.insightface/models/buffalo_l
    import zipfile
    buffalo_zip = os.path.join(MODELS_DIR, "buffalo_l.zip")
    extract_dir = os.path.expanduser("~/.insightface/models/buffalo_l")
    if not os.path.exists(extract_dir) and os.path.exists(buffalo_zip):
        print("Extracting InsightFace model...")
        os.makedirs(extract_dir, exist_ok=True)
        with zipfile.ZipFile(buffalo_zip, 'r') as zip_ref:
            zip_ref.extractall(extract_dir)
        print("Extraction complete.")
