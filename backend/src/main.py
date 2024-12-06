from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SignLingo ASL Inference API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to SignLingo ASL Inference API"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Receive the frame data from the client
            data = await websocket.receive_bytes()
            
            # TODO: Add your inference logic here
            # For now, just echo back a placeholder response
            result = {"prediction": "example_sign"}
            
            # Send the result back to the client
            await websocket.send_json(result)
    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        await websocket.close() 