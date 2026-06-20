import cv2
import numpy as np
import os
import onnxruntime

class AntiSpoofService:
    def __init__(self, model_path="antispoof.onnx"):
        self.model_path = model_path
        self.session = None
        
        if os.path.exists(self.model_path):
            try:
                self.session = onnxruntime.InferenceSession(self.model_path, providers=['CPUExecutionProvider'])
                self.input_name = self.session.get_inputs()[0].name
            except Exception as e:
                print(f"Failed to load ONNX AntiSpoof model: {e}")
        else:
            print("Warning: MiniFASNet Anti-Spoofing ONNX model not found. Using structural fallback.")

    def detect_spoof(self, image: np.ndarray) -> dict:
        """
        Returns a dict with:
        - is_real: bool
        - score: float (confidence of being real)
        - message: str (e.g., 'Real Human Face', 'Spoof: Printed Image')
        """
        if self.session is not None:
            return self._onnx_inference(image)
        else:
            return self._fallback_inference(image)

    def _onnx_inference(self, image: np.ndarray) -> dict:
        # MiniFASNet typically expects an 80x80 RGB image
        resized = cv2.resize(image, (80, 80))
        img_rgb = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
        
        # Normalize
        img_blob = img_rgb.astype(np.float32) / 255.0
        # Transpose to NCHW
        img_blob = np.transpose(img_blob, (2, 0, 1))
        img_blob = np.expand_dims(img_blob, axis=0)

        try:
            preds = self.session.run(None, {self.input_name: img_blob})[0]
            # Output is usually [prob_spoof, prob_real] or similar
            # Assuming standard 2-class output where class 1 is real
            prob = float(preds[0][1]) if len(preds[0]) > 1 else float(preds[0][0])
            
            is_real = prob >= 0.80
            msg = "Real Human Face" if is_real else "Spoof Attempt Detected"
            return {"is_real": is_real, "score": prob, "message": msg}
        except Exception as e:
            print(f"ONNX Inference error: {e}")
            return self._fallback_inference(image)

    def _fallback_inference(self, image: np.ndarray) -> dict:
        """
        A structural fallback when the Deep Learning model is unavailable.
        Uses Laplacian variance to detect blurred/printed photos 
        and histogram analysis to detect flat screen lighting.
        """
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # 1. Blur Detection (Printed photos are often blurry when held up to a webcam)
        variance = cv2.Laplacian(gray, cv2.CV_64F).var()
        if variance < 80:
            return {"is_real": False, "score": 0.1, "message": "Spoof: Printed Image / Replay Attack (Low Sharpness)"}

        # 2. Specular reflection / Screen glare detection (Screens have harsh bright spots)
        _, thresh = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY)
        bright_spots = cv2.countNonZero(thresh)
        total_pixels = gray.shape[0] * gray.shape[1]
        
        if (bright_spots / total_pixels) > 0.05:
            return {"is_real": False, "score": 0.2, "message": "Spoof: Phone Screen Detected (Glare)"}

        # Passes basic structural checks
        return {"is_real": True, "score": 0.85, "message": "Real Human Face"}
