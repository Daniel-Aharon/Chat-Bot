# Chat Bot Application

A full-stack chat application with a React frontend and FastAPI backend, containerized using Docker.

## Project Structure

```
.
├── frontend/           # React frontend application
├── backend/           # FastAPI backend application
├── docker-compose.yml # Docker Compose configuration
├── .github/
│   └── workflows/
│       └── ci.yml     # GitHub Actions workflow for CI
└── README.md
```

## Prerequisites

- Docker
- Docker Compose
- OpenAI API Key

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/Daniel-Aharon/Chat-Bot.git
cd api-chat-bot
```

2. Create a `.env` file in the root directory with your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

3. Run the application using Docker Compose:
```bash
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:8001
- Backend: http://localhost:8000

## Docker Images

The application uses two Docker images:

1. Frontend (`danielaharon555/chat_bot_frontend:1.0.0`)
   - Built with Node.js and Nginx
   - Serves the React application
   - Exposed on port 8001

2. Backend (`danielaharon555/chat_bot_backend:1.0.0`)
   - Built with Python and FastAPI
   - Handles chat functionality
   - Exposed on port 8000

## Manual Build and Run

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Build the Docker image:
```bash
docker build -t chat_bot_frontend:1.0.0 .
```

3. Run the container:
```bash
docker run -p 8001:8001 chat_bot_frontend:1.0.0
```

### Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build the Docker image:
```bash
docker build -t chat_bot_backend:1.0.0 .
```

3. Run the container:
```bash
docker run -p 8000:8000 -e OPENAI_API_KEY=your_api_key_here chat_bot_backend:1.0.0
```

## Docker Compose

The `docker-compose.yml` file orchestrates both services:

```yaml
version: '3.8'

services:
  frontend:
    image: danielaharon555/chat_bot_frontend:1.0.0
    ports:
      - "8001:8001"
    depends_on:
      - backend
    networks:
      - chat-network

  backend:
    image: danielaharon555/chat_bot_backend:1.0.0
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    networks:
      - chat-network

networks:
  chat-network:
    driver: bridge
```

## Development

### Frontend Development

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

### Backend Development

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start development server:
```bash
python app.py
```

## Continuous Integration

This project uses GitHub Actions for continuous integration.  
The workflow is defined in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) and runs tests and checks for both frontend and backend on every push and pull request.

## API Endpoints

- `GET /health`: Health check endpoint
- `POST /chat`: Chat endpoint for sending messages
- `WS /ws/{session_id}`: WebSocket endpoint for real-time chat

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required for backend)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.