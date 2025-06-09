import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const BACKEND_URL = 'http://localhost:8000';
const WS_URL = 'ws://localhost:8000';

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm NeuraChat, your advanced AI assistant. I'm here to help you with anything you need. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize WebSocket connection
    console.log('Attempting to connect to WebSocket...');
    const ws = new WebSocket(`${WS_URL}/ws/${sessionId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connection established successfully');
      toast({
        title: "Connected",
        description: "Successfully connected to chat server",
      });
    };

    ws.onmessage = (event) => {
      console.log('Received message:', event.data);
      const data = JSON.parse(event.data);
      if (data.status === 'success') {
        const aiMessage: Message = {
          id: Date.now().toString(),
          content: data.response,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      } else {
        console.error('Error in response:', data);
        toast({
          title: "Error",
          description: data.response,
          variant: "destructive",
        });
        setIsTyping(false);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the chat server. Please try again later.",
        variant: "destructive",
      });
      setIsTyping(false);
    };

    ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
    };

    return () => {
      if (wsRef.current) {
        console.log('Cleaning up WebSocket connection...');
        wsRef.current.close();
      }
    };
  }, [sessionId, toast]);

  const sendMessage = async () => {
    if (!inputValue.trim() || !wsRef.current) {
      console.log('Cannot send message:', { inputValue, wsConnected: !!wsRef.current });
      return;
    }

    console.log('Sending message:', inputValue);
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const messageData = {
        message: inputValue,
        session_id: sessionId
      };
      console.log('Sending WebSocket message:', messageData);
      wsRef.current.send(JSON.stringify(messageData));
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="glass-effect border-b border-white/10 p-4 z-10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neura-cyan-400 to-neura-blue-500 flex items-center justify-center animate-pulse-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-neura-cyan-300 to-neura-blue-300 bg-clip-text text-transparent">
              NeuraChat
            </h1>
            <p className="text-sm text-muted-foreground">Advanced AI Assistant</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 animate-slide-up ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'ai' 
                  ? 'bg-gradient-to-r from-neura-cyan-400 to-neura-blue-500' 
                  : 'bg-gradient-to-r from-purple-400 to-pink-400'
              }`}>
                {message.sender === 'ai' ? (
                  <Bot className="w-4 h-4 text-white" />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <div className={`message-bubble max-w-2xl ${
                message.sender === 'ai' 
                  ? 'bg-gradient-to-r from-slate-800/50 to-slate-700/50' 
                  : 'bg-gradient-to-r from-neura-blue-500/20 to-neura-cyan-500/20'
              }`}>
                <p className="text-foreground leading-relaxed">{message.content}</p>
                <div className="text-xs text-muted-foreground mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start space-x-3 animate-slide-up">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-neura-cyan-400 to-neura-blue-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="message-bubble bg-gradient-to-r from-slate-800/50 to-slate-700/50">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="glass-effect border-t border-white/10 p-4 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message to NeuraChat..."
                className="bg-slate-800/50 border-white/20 text-foreground placeholder:text-muted-foreground pr-12 h-12 rounded-2xl focus:ring-2 focus:ring-neura-cyan-400/50 focus:border-neura-cyan-400/50 transition-all duration-200"
                disabled={isTyping}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="sm"
                  className="bg-gradient-to-r from-neura-cyan-500 to-neura-blue-500 hover:from-neura-cyan-400 hover:to-neura-blue-400 text-white border-0 rounded-xl h-8 w-8 p-0 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
