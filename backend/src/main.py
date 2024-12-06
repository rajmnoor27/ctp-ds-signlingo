from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import json
from inference.model import ASLInferenceModel

app = FastAPI(title="SignLingo ASL Inference API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the model
model = ASLInferenceModel()

@app.get("/")
async def root():
    return {"message": "Welcome to SignLingo ASL Inference API"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    print("Client attempting to connect...")
    await websocket.accept()
    print("Client connected successfully")
    
    try:
        while True:
            # Receive the landmark data as JSON
            data = await websocket.receive_text()
            landmarks = json.loads(data)
            
            # Ensure we're getting the landmarks array
            if isinstance(landmarks, list) and len(landmarks) > 0:
                # Get the first frame of landmarks (assuming single frame processing)
                frame_landmarks = landmarks[0]
                
                # Make prediction
                result = model.predict(frame_landmarks)
                print(f"Prediction made: {result}")
                
                # Send the result back to the client
                await websocket.send_json(result)
            else:
                await websocket.send_json({
                    "error": "Invalid landmark data format",
                    "prediction": None,
                    "confidence": 0.0
                })
    except Exception as e:
        print(f"Error in WebSocket connection: {str(e)}")
        try:
            await websocket.send_json({
                "error": str(e),
                "prediction": None,
                "confidence": 0.0
            })
        except:
            pass
    finally:
        print("Client disconnected")
        try:
            await websocket.close()
        except:
            pass 