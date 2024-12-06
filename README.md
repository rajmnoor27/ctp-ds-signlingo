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
- Python 3.8+
- pip
- npm or yarn

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
