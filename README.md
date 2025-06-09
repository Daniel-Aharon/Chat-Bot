# AI Chat Application

A full-stack chat application that leverages OpenAI's GPT-3.5 Turbo model to provide intelligent conversational responses. The application features a modern React frontend with real-time WebSocket communication and a FastAPI backend.

## 🚀 Features

- Real-time chat interface with WebSocket support
- Integration with OpenAI's GPT-3.5 Turbo model
- Modern, responsive UI built with React and Tailwind CSS
- Session-based conversation history
- TypeScript support for better development experience
- FastAPI backend with async support

## 🏗️ Project Structure

```
.
├── frontend/               # React + TypeScript frontend
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   └── [config files]     # TypeScript, Vite, and other configs
├── backend/               # FastAPI backend
│   ├── app.py            # Main application file
│   └── requirements.txt   # Python dependencies
└── venv/                 # Python virtual environment
```

## 🛠️ Technology Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn-ui for UI components
- WebSocket for real-time communication

### Backend
- FastAPI (Python)
- OpenAI API integration
- WebSocket support
- Environment variable management with python-dotenv

## 🚀 Getting Started

### Prerequisites
- Node.js & npm (for frontend)
- Python 3.8+ (for backend)
- OpenAI API key

### Backend Setup

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory:
```
OPENAI_API_KEY=your_api_key_here
```

### Frontend Setup

1. Install frontend dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

## 🏃‍♂️ Running the Application

1. Start the backend server:
```bash
cd backend
python app.py
```

2. In a separate terminal, start the frontend:
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173` (frontend) and `http://localhost:8000` (backend).

## 🔧 Development

### Frontend Development
- The frontend uses Vite for fast development and building
- TypeScript provides type safety and better development experience
- Tailwind CSS is used for styling
- shadcn-ui components are available for consistent UI

### Backend Development
- FastAPI provides automatic API documentation at `/docs`
- WebSocket support for real-time communication
- Conversation history is maintained per session
- Error handling for API failures

## 🔒 Security Notes

- Never commit your OpenAI API key to version control
- Keep your `.env` file secure and local
- The application uses environment variables for sensitive data

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 