'use client';
import { useState } from 'react';
import { sendMessageToChatbot } from '@/utils/chatbot';
import { MessageSquare, X, Send } from 'lucide-react';

export default function Chatbot() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message };
    setConversation((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const botReply = await sendMessageToChatbot(message);
      const botMessage = { role: 'assistant', content: botReply };
      setConversation((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
      setMessage('');
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-80 bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Chat Header */}
          <div className="bg-blue-500 text-white p-3 flex justify-between items-center">
            <span className="font-semibold">Chat Assistant</span>
            <button 
              onClick={toggleChat} 
              className="text-white hover:bg-blue-600 rounded p-1"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Chat Messages */}
          <div className="h-64 overflow-y-auto p-4">
            {conversation.length === 0 ? (
              <div className="text-gray-500 text-center py-4">
                Welcome to Travel Aura Chatbot, How can I help you today?
              </div>
            ) : (
              conversation.map((msg, index) => (
                <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <span 
                    className={`inline-block p-2 rounded-lg max-w-xs break-words ${
                      msg.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {msg.content}
                  </span>
                </div>
              ))
            )}
            {loading && (
              <div className="text-left mb-2">
                <span className="inline-block p-2 rounded-lg bg-gray-200 text-gray-800">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </span>
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <div className="border-t p-2 flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 p-2 border rounded-l outline-none"
              placeholder="Type a message..."
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
}