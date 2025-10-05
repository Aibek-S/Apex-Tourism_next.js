import geminiApiQueue from './apiQueue';

// Utility functions for interacting with the Gemini API proxy server

const SERVER_URL = process.env.NEXT_PUBLIC_GEMINI_SERVER_URL || 'http://localhost:3001';

// AI assistant context for tourism guide
const AI_CONTEXT = `Ты — чат-бот-туроводитель для Мангистауской области.
Правила работы:
1. Отвечай только на одном из 3 языков: казахский, русский и английский. в зависимости на каком языке говорит пользователь.
2. Используй только данные из базы данных приложения (не придумывай факты).
3. Стиль речи — молодежный, простой и понятный, без сложных формулировок.
4. Тема всегда ограничена туризмом: достопримечательности, маршруты, культура, сервисы Мангистау.
5. Если информации в базе нет — говори об этом напрямую, не выдумывай.
6. Ширина твоего ответа не более 200 символов. ограничивайся короткостью если пользователь не просит об этом.
Контекст разговора:`;

interface ContextMessage {
  text: string;
  sender: string;
}

/**
 * Send a message to the Gemini API through our proxy server
 * @param message - The message to send to Gemini
 * @returns The response from Gemini
 */
export async function sendGeminiMessage(message: string): Promise<string> {
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
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        });
      }
      return response.json();
    }).then(data => data.reply);
  };

  // Add the request to the queue and return the promise
  return geminiApiQueue.add(requestFn);
}

/**
 * Send a message to the Gemini API with conversation context
 * @param contextMessages - Array of message objects with text and sender properties
 * @returns The response from Gemini
 */
export async function sendGeminiMessageWithContext(contextMessages: ContextMessage[]): Promise<string> {
  // Create a request function that will be queued
  const requestFn = () => {
    return fetch(`${SERVER_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: formatContextForPrompt(contextMessages)
      }),
    }).then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        });
      }
      return response.json();
    }).then(data => data.reply);
  };

  // Add the request to the queue and return the promise
  return geminiApiQueue.add(requestFn);
}

/**
 * Format conversation context into a single prompt string
 * @param contextMessages - Array of message objects with text and sender properties
 * @returns Formatted prompt string
 */
function formatContextForPrompt(contextMessages: ContextMessage[]): string {
  // If no context, return AI context only
  if (!contextMessages || contextMessages.length === 0) {
    return `${AI_CONTEXT}\n\nПользователь: `;
  }

  // Format the context messages into a conversation format
  // Each message is prefixed with the sender role
  const formattedContext = contextMessages.map(msg => {
    const role = msg.sender === 'user' ? 'Пользователь' : 'Туроводитель';
    return `${role}: ${msg.text}`;
  }).join('\n');

  // Add AI context and prompt for continuation
  return `${AI_CONTEXT}\n\n${formattedContext}\nТуроводитель:`;
}

/**
 * Check if the server is healthy
 * @returns True if server is healthy
 */
export async function checkServerHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${SERVER_URL}/api/health`);
    return response.ok;
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
}