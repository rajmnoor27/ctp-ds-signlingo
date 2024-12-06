import numpy as np
import pickle
import json
from pathlib import Path
from typing import Dict, Any, List

class ASLInferenceModel:
    def __init__(self):
        # Load the model from the models directory
        model_path = Path(__file__).parent.parent.parent / "models" / "model.p"
        try:
            with open(model_path, 'rb') as f:
                model_dict = pickle.load(f)
                self.model = model_dict['model']
                print("Model loaded successfully!")
                if hasattr(self.model, 'n_estimators'):
                    print(f"Using Random Forest with {self.model.n_estimators} trees")
                print("This model was trained on combined data from multiple users")
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            self.model = None
        
    def preprocess_landmarks(self, landmarks_data: List[Dict[str, float]]) -> np.ndarray:
        """
        Preprocess the landmark data using the same logic as in training.
        
        Args:
            landmarks_data: List of dictionaries containing x, y coordinates
        Returns:
            np.ndarray: Processed landmark features (42 features: 21 normalized x coords, 21 normalized y coords)
        """
        if len(landmarks_data) != 21:
            raise ValueError(f"Expected 21 landmarks, got {len(landmarks_data)}")
            
        # Extract x and y coordinates
        x_ = []
        y_ = []
        
        # Collect coordinates first (matching your inference code)
        for landmark in landmarks_data:
            x_.append(landmark['x'])
            y_.append(landmark['y'])
        
        # Create normalized feature vector (matching your inference code)
        data_aux = []
        min_x = min(x_)
        min_y = min(y_)
        
        for i in range(len(landmarks_data)):
            data_aux.append(x_[i] - min_x)
            data_aux.append(y_[i] - min_y)
            
        return np.asarray(data_aux, dtype=np.float32)
        
    def predict(self, landmarks: List[Dict[str, float]]) -> Dict[str, Any]:
        """
        Make a prediction based on the hand landmarks.
        
        Args:
            landmarks: List of dictionaries containing x, y coordinates
        Returns:
            Dict containing prediction and confidence
        """
        if self.model is None:
            return {
                "error": "Model not loaded",
                "prediction": None,
                "confidence": 0.0
            }
        
        try:
            # Preprocess the landmarks
            data_aux = self.preprocess_landmarks(landmarks)
            
            # Ensure we have 42 features (21 landmarks * 2 coordinates)
            if len(data_aux) != 42:
                raise ValueError(f"Expected 42 features after preprocessing, got {len(data_aux)}")
            
            # Make prediction
            prediction = self.model.predict([data_aux])[0]
            
            # Get prediction probability if available
            confidence = 0.0  # Default to 0 if probability is not available
            try:
                if hasattr(self.model, 'predict_proba'):
                    probabilities = self.model.predict_proba([data_aux])[0]
                    confidence = float(np.max(probabilities))
            except Exception as e:
                print(f"Warning: Could not calculate prediction probability: {str(e)}")
            
            return {
                "prediction": str(prediction),
                "confidence": confidence
            }
            
        except Exception as e:
            return {
                "error": str(e),
                "prediction": None,
                "confidence": 0.0
            }