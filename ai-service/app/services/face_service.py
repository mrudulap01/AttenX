import cv2
import numpy as np
from insightface.app import FaceAnalysis
from .antispoof_service import AntiSpoofService

class FaceRecognitionService:
    def __init__(self):
        # Initialize InsightFace model
        self.app = FaceAnalysis(name='buffalo_l', providers=['CPUExecutionProvider'])
        self.app.prepare(ctx_id=-1, det_size=(640, 640))
        self.antispoof = AntiSpoofService()
        
    def _get_embedding(self, img_bytes: bytes):
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Invalid image")
        
        faces = self.app.get(img)
        if len(faces) == 0:
            raise ValueError("No face detected in the image")
        if len(faces) > 1:
            raise ValueError("Multiple faces detected. Please ensure only one face is visible.")
            
        return faces[0].embedding
        
    def generate_mean_embedding(self, front_bytes, left_bytes, right_bytes):
        emb_front = self._get_embedding(front_bytes)
        emb_left = self._get_embedding(left_bytes)
        emb_right = self._get_embedding(right_bytes)
        
        # Calculate mean embedding for robustness
        mean_embedding = np.mean([emb_front, emb_left, emb_right], axis=0)
        
        # Normalize the embedding vector
        norm_embedding = mean_embedding / np.linalg.norm(mean_embedding)
        return norm_embedding.tolist()
        
    def verify_face(self, live_bytes, stored_embedding_list, threshold=0.5):
        # 1. Decode image bytes for antispoofing
        nparr = np.frombuffer(live_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Invalid image")

        # 2. Run Anti-Spoofing Check
        spoof_result = self.antispoof.detect_spoof(img)
        if not spoof_result["is_real"]:
            raise ValueError(f"Spoofing detected: {spoof_result['message']}")

        # 3. Extract embedding and compare
        live_embedding = self._get_embedding(live_bytes)
        stored_embedding = np.array(stored_embedding_list, dtype=np.float32)
        
        # Calculate Cosine similarity
        similarity = np.dot(live_embedding, stored_embedding) / (np.linalg.norm(live_embedding) * np.linalg.norm(stored_embedding))
        
        return {
            "similarity": float(similarity),
            "verified": bool(similarity >= threshold),
            "liveness_score": spoof_result["score"]
        }
