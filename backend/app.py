from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from openai import OpenAI
from dotenv import load_dotenv
from typing import Dict, List
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI()

# Add CORS middleware with more permissive settings for testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url="https://api.openai.com/v1"
)

# Store conversation history (in a real app, you'd use a database)
conversations: Dict[str, List[dict]] = {}

@app.get("/health")
async def health_check():
    """Health check endpoint to verify the server is running"""
    return {"status": "healthy", "message": "Server is running"}

@app.post("/chat")
async def chat(message: dict):
    try:
        if not isinstance(message, dict):
            raise HTTPException(status_code=400, detail="Invalid request format")
            
        user_message = message.get('message', '')
        session_id = message.get('session_id', 'default')
        
        if not user_message:
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        # Initialize conversation history for new sessions
        if session_id not in conversations:
            conversations[session_id] = [
                {"role": "system", "content": "You are a helpful assistant."}
            ]
        
        # Add user message to conversation history
        conversations[session_id].append({"role": "user", "content": user_message})
        
        # Get response from OpenAI
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=conversations[session_id]
        )
        
        # Get assistant's response
        assistant_response = response.choices[0].message.content
        
        # Add assistant's response to conversation history
        conversations[session_id].append({"role": "assistant", "content": assistant_response})
        
        return {
            "response": assistant_response,
            "status": "success"
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# WebSocket endpoint for real-time chat
@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    logger.info(f"New WebSocket connection request for session {session_id}")
    await websocket.accept()
    logger.info(f"WebSocket connection established for session {session_id}")
    
    # Initialize conversation history for new sessions
    if session_id not in conversations:
        logger.info(f"Initializing new conversation for session {session_id}")
        conversations[session_id] = [
            {"role": "system", "content": "You are a helpful assistant."}
        ]
    
    try:
        while True:
            # Receive message from client
            logger.info(f"Waiting for message from session {session_id}")
            data = await websocket.receive_text()
            logger.info(f"Received message from session {session_id}: {data}")
            
            message_data = json.loads(data)
            user_message = message_data.get('message', '')
            
            if not user_message:
                logger.warning(f"Empty message received from session {session_id}")
                await websocket.send_json({
                    "response": "Message cannot be empty",
                    "status": "error"
                })
                continue
            
            # Add user message to conversation history
            conversations[session_id].append({"role": "user", "content": user_message})
            
            try:
                # Get response from OpenAI
                logger.info(f"Getting OpenAI response for session {session_id}")
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=conversations[session_id]
                )
                
                # Get assistant's response
                assistant_response = response.choices[0].message.content
                logger.info(f"Received OpenAI response for session {session_id}")
                
                # Add assistant's response to conversation history
                conversations[session_id].append({"role": "assistant", "content": assistant_response})
                
                # Send response back to client
                logger.info(f"Sending response to session {session_id}")
                await websocket.send_json({
                    "response": assistant_response,
                    "status": "success"
                })
                
            except Exception as e:
                logger.error(f"Error in WebSocket chat for session {session_id}: {str(e)}")
                await websocket.send_json({
                    "response": f"An error occurred: {str(e)}",
                    "status": "error"
                })
                
    except WebSocketDisconnect:
        logger.info(f"WebSocket connection closed for session {session_id}")
    except Exception as e:
        logger.error(f"WebSocket error for session {session_id}: {str(e)}")
    finally:
        await websocket.close()
        logger.info(f"WebSocket connection cleaned up for session {session_id}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000) 