import geminiApiQueue from './apiQueue';

// Utility functions for interacting with the Gemini API proxy server

const SERVER_URL = process.env.NEXT_PUBLIC_GEMINI_SERVER_URL || (process.env.VERCEL ? '' : 'http://localhost:3001');

// AI assistant context for tourism guide
const AI_CONTEXT = `Ты — чат-бот-туроводитель для Мангистауской области.
Правила работы:
1. Отвечай только на одном из 3 языков: казахский, русский и английский. в зависимости на каком языке говорит пользователь.
2. Используй только данные из базы данных приложения (не придумывай факты).
3. Стиль речи — молодежный, простой и понятный, без сложных формулировок.
4. Тема всегда ограничена туризмом: достопримечательности, маршруты, культура, сервисы Мангистау.
5. Если информации в базе нет — говори об этом напрямую, не выдумывай.
6. Ширина твоего ответа не более 500 символов. ограничивайся короткостью если пользователь не просит об этом.
Контекст разговора:`;

interface ContextMessage {
  text: string;
  sender: string;
}

/**
 * Send a message to the Gemini API through our Next.js API route
 * @param message - The message to send to Gemini
 * @returns The response from Gemini
 */
export async function sendGeminiMessage(message: string): Promise<string> {
  try {
    // If we have a server URL, use it (for local development with custom server)
    if (SERVER_URL) {
      // Create a request function that will be queued
      const requestFn = () => {
        return fetch(`${SERVER_URL}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
        }).then(response => {
          if (!response.ok) {
            return response.json().then(errorData => {
              throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
            });
          }
          return response.json();
        }).then(data => data.reply);
      };

      // Add the request to the queue and return the promise
      return geminiApiQueue.add(requestFn);
    }

    // Otherwise, use the Next.js API route (for Vercel deployment)
    const requestFn = () => {
      return fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      }).then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
          });
        }
        return response.json();
      }).then(data => data.reply);
    };

    // Add the request to the queue and return the promise
    return geminiApiQueue.add(requestFn);
  } catch (error: unknown) {
    console.error('Error in sendGeminiMessage:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to send message to AI assistant: ${error.message}`);
    } else {
      throw new Error(`Failed to send message to AI assistant: Unknown error occurred`);
    }
  }
}

/**
 * Send a message to the Gemini API with conversation context
 * @param contextMessages - Array of message objects with text and sender properties
 * @returns The response from Gemini
 */
export async function sendGeminiMessageWithContext(contextMessages: ContextMessage[]): Promise<string> {
  try {
    // Format the context messages into a single message for the API
    const formattedContext = contextMessages.map(msg => 
      `${msg.sender === 'user' ? 'Пользователь' : 'Туроводитель'}: ${msg.text}`
    ).join('\n');

    // If we have a server URL, use it (for local development with custom server)
    if (SERVER_URL) {
      // Create a request function that will be queued
      const requestFn = () => {
        return fetch(`${SERVER_URL}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            message: formattedContext
          }),
        }).then(response => {
          if (!response.ok) {
            return response.json().then(errorData => {
              throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
            });
          }
          return response.json();
        }).then(data => data.reply);
      };

      // Add the request to the queue and return the promise
      return geminiApiQueue.add(requestFn);
    }

    // Otherwise, use the Next.js API route (for Vercel deployment)
    const requestFn = () => {
      return fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: formattedContext
        }),
      }).then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
          });
        }
        return response.json();
      }).then(data => data.reply);
    };

    // Add the request to the queue and return the promise
    return geminiApiQueue.add(requestFn);
  } catch (error: unknown) {
    console.error('Error in sendGeminiMessageWithContext:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to send message to AI assistant: ${error.message}`);
    } else {
      throw new Error(`Failed to send message to AI assistant: Unknown error occurred`);
    }
  }
}

/**
 * Check if the server is healthy
 * @returns True if server is healthy
 */
export async function checkServerHealth(): Promise<boolean> {
  try {
    // If we have a server URL, check that server
    if (SERVER_URL) {
      const response = await fetch(`${SERVER_URL}/api/health`);
      return response.ok;
    }
    
    // Otherwise, check the Next.js API route
    const response = await fetch('/api/health');
    return response.ok;
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
}
