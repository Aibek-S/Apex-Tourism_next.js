import React, { lazy, Suspense } from 'react';

// Lazy load the ChatBot component
const ChatBot = lazy(() => import('./ChatBot'));

// Loading component to show while ChatBot is loading
const ChatBotLoading = () => (
  <div className="chat-loading">
    <div className="chat-loading-spinner"></div>
    <p>Loading chat...</p>
  </div>
);

// Error component to show if ChatBot fails to load
const ChatBotError = () => (
  <div className="chat-error">
    <p>Failed to load chat component. Please try again later.</p>
  </div>
);

const LazyChatBot = () => {
  return (
    <Suspense fallback={<ChatBotLoading />}>
      <ChatBot />
    </Suspense>
  );
};

export default LazyChatBot;