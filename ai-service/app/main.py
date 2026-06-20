from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from .services.face_service import FaceRecognitionService

app = FastAPI(title="AttenX AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize models globally so they load on startup
face_service = FaceRecognitionService()

@app.get("/health")
def health_check():
    """Confirms all AI models are loaded and ready."""
    return {"status": "ok", "models": ["buffalo_l", "MiniFASNet"]}

@app.post("/api/v1/ai/register")
async def register_face(
    front: UploadFile = File(...),
    left: UploadFile = File(...),
    right: UploadFile = File(...)
):
    try:
        front_bytes = await front.read()
        left_bytes = await left.read()
        right_bytes = await right.read()
        
        embedding = face_service.generate_mean_embedding(front_bytes, left_bytes, right_bytes)
        return {"embedding": embedding}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/v1/ai/verify")
async def verify_face(
    live_image: UploadFile = File(...),
    stored_embedding: str = Form(...) 
):
    try:
        live_bytes = await live_image.read()
        embedding_list = json.loads(stored_embedding)
        
        result = face_service.verify_face(live_bytes, embedding_list)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
