# SignLingo Backend

This is the backend service for SignLingo, an ASL inference application that uses FastAPI and WebSocket for real-time sign language recognition.

## Setup

1. Make sure you have Python 3.8+ installed
2. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

## Running the Server

To run the development server:

```bash
cd src
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:

- HTTP: http://localhost:8000
- WebSocket: ws://localhost:8000/ws
- API Documentation: http://localhost:8000/docs

## Project Structure

```
backend/
├── src/
│   ├── main.py              # FastAPI application and WebSocket endpoints
│   └── inference/
│       └── model.py         # ASL inference model implementation
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## WebSocket Protocol

The WebSocket endpoint accepts binary frame data and returns JSON predictions:

```python
# Example response format:
{
    "prediction": "sign_name",
    "confidence": 0.95
}
```
