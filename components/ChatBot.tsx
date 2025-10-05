import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { sendGeminiMessageWithContext } from '../utils/geminiClient';
import geminiApiQueue from '../utils/apiQueue';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  isError?: boolean;
}

const ChatBot = ({ showHeader = true, onClose }: { showHeader?: boolean; onClose?: () => void }) => {
  // Use language context for translations
  const { t } = useLanguage();
  
  // State to store conversation history (pseudo-context)
  // Each message object contains: { id, text, sender }
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  
  // State for current input and UI states
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [queueLength, setQueueLength] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory]);

  // Focus input on initial render
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Update queue length
  useEffect(() => {
    const updateQueueLength = () => {
      setQueueLength(geminiApiQueue.length);
    };

    // Initial update
    updateQueueLength();

    // Set up interval to update queue length
    const interval = setInterval(updateQueueLength, 100);

    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    try {
      // Add user message to conversation history
      const userMessage: Message = { id: Date.now(), text: inputValue, sender: 'user' };
      const updatedHistory = [...conversationHistory, userMessage];
      
      // Limit conversation history to last 5 messages
      const limitedHistory = updatedHistory.slice(-5);
      setConversationHistory(limitedHistory);
      
      // Clear input and set loading state
      setInputValue('');
      setIsLoading(true);
      setError('');

      // Get bot response with context
      // Pass the last 3-5 messages as context
      const contextMessages = limitedHistory.slice(-5); // Get last 5 messages
      const response = await sendGeminiMessageWithContext(contextMessages);
      
      // Add bot message to conversation history
      const botMessage: Message = { id: Date.now() + 1, text: response, sender: 'bot' };
      const finalHistory = [...limitedHistory, botMessage].slice(-5); // Keep only last 5
      setConversationHistory(finalHistory);
    } catch (err: any) {
      setError(err.message || t('error'));
      // Add error message to conversation history
      const errorMessage: Message = { 
        id: Date.now(), 
        text: t('chatError'), 
        sender: 'bot',
        isError: true
      };
      const updatedHistory = [...conversationHistory, errorMessage].slice(-5);
      setConversationHistory(updatedHistory);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="chat-container">
      {/* Chat header */}
      {showHeader && (
        <div className="chat-header">
          <div className="chat-header-content">
            <div>
              <h2>{t('aiAssistant')}</h2>
            </div>
            {queueLength > 0 && (
              <div className="queue-indicator">
                {t('queuePending')} {queueLength}
              </div>
            )}
            {onClose && (
              <button 
                onClick={onClose}
                className="chat-close-button"
                aria-label={t('closeChat')}
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

      {/* Messages container */}
      <div className="chat-messages">
        {/* Welcome message when chat is empty */}
        {conversationHistory.length === 0 && !isLoading && (
          <div className="welcome-message">
            <p>{t('chatWelcomeMessage')}</p>
          </div>
        )}

        {conversationHistory.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender}`}
          >
            <div
              className={`message-bubble ${message.sender} ${message.isError ? 'error' : ''}`}
            >
              {message.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message bot">
            <div className="message-bubble bot typing-indicator">
              <div className="typing-dots">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">{error}</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="chat-input-form">
        <div className="input-group">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={t('typeMessage')}
            className="chat-input"
            aria-label={t('typeMessage')}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="btn chat-send-button"
            aria-label={t('sendMessage')}
          >
            {t('send')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBot;