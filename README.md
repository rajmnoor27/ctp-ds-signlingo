# SignLingo - ASL Learning Platform

SignLingo is an interactive American Sign Language (ASL) learning platform that uses real-time hand tracking and machine learning to help users learn and practice ASL letters.

## Features

- Real-time hand tracking using MediaPipe
- Interactive ASL letter practice
- Real-time feedback on sign accuracy
- Progressive learning through multiple quizzes
- WebSocket-based communication for instant feedback
- 4-second hold verification for accurate sign learning

## Tech Stack

### Frontend

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- MediaPipe Hand Tracking
- WebSocket Client

### Backend

- FastAPI
- Python 3.8+
- scikit-learn
- WebSocket Server

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.12.4 training
- Python 3.11.0 backend
- pip
- npm or yarn

### Training the Model

1. Set up the Python environment:

```bash
cd training
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```

2. Run the training pipeline in the following order:

```bash
# 1. Collect images for training
python collect_imgs.py

# 2. Create and preprocess the dataset
python create_dataset.py

# 3. Train the classifier
python train_classifier.py

# 4. Test the trained model
python inference_classifier.py
```

Note: The training process will create a `/data` directory to store images and a `/models` directory for the trained models. These directories are gitignored.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/signlingo.git
cd signlingo
```

2. Install and run the backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
cd src
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

3. Install and run the frontend:

```bash
cd frontend
npm install
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Deployment on Render

This project is configured as a monorepo for deployment on Render.com. The `render.yaml` file in the root directory contains all necessary configuration for both frontend and backend services.

### Deployment Steps

1. Fork or clone this repository to your GitHub account

2. Create a new account on [Render](https://render.com) if you haven't already

3. In your Render dashboard:

   - Click "New +"
   - Select "Blueprint"
   - Connect your GitHub account and select your SignLingo repository
   - Click "Apply"

4. Render will automatically:
   - Detect the `render.yaml` configuration
   - Create both frontend and backend services
   - Deploy them with the specified settings

### Environment Variables

The following environment variables are automatically set in `render.yaml`:

Frontend:

- `NEXT_PUBLIC_API_URL`: URL of the backend API
- `NEXT_PUBLIC_WS_URL`: WebSocket URL for real-time communication

Backend:

- `PORT`: Automatically set by Render
- `PYTHON_VERSION`: Set to 3.8.0

### Monorepo Configuration

The project uses Render's Monorepo support with:

1. Root Directory settings:

   - Backend: `backend/`
   - Frontend: `frontend/`

2. Build Filters to trigger deployments only when relevant files change:
   - Backend: Python files and requirements.txt
   - Frontend: TypeScript, JavaScript, CSS, and package files

### Deployment URLs

After successful deployment, your services will be available at:

- Frontend: `https://signlingo-frontend.onrender.com`
- Backend: `https://signlingo-backend.onrender.com`
- WebSocket: `wss://signlingo-backend.onrender.com/ws`

## Project Structure

```
signlingo/
├── backend/
│   ├── src/
│   │   ├── main.py              # FastAPI application
│   │   └── inference/
│   │       └── model.py         # ASL inference model
│   └── requirements.txt
└── frontend/
    ├── app/
    │   └── (quiz)/             # Quiz pages
    ├── components/
    │   └── VideoStream.tsx     # Hand tracking component
    ├── contexts/
    │   └── WebSocketContext.tsx # WebSocket management
    └── package.json
```

## Usage

1. Start with Quiz 1 to learn basic ASL letters
2. Practice each letter by showing it to your camera
3. Hold each sign correctly for 4 seconds to progress
4. Complete all letters in a quiz to move to the next one

## Development

- Frontend runs on port 3000
- Backend runs on port 8000
- WebSocket connection is established at `ws://localhost:8000/ws`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
