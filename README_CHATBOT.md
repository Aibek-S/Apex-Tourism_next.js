# Gemini Chat Bot Setup and Usage

## Setup Instructions

1. **Get a Gemini API Key**:
   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Create a new API key
   - Copy the API key

2. **Configure Environment Variables**:
   - Make sure your `.env.local` file contains:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_actual_gemini_api_key_here
   NEXT_PUBLIC_GEMINI_SERVER_URL=http://localhost:3001
   ```

3. **Start the Development Servers**:
   - Terminal 1: Start the Next.js development server
     ```bash
     npm run dev
     ```
   - Terminal 2: Start the Gemini API proxy server
     ```bash
     npm run server
     ```

## Usage Instructions

1. **Access the Chat**:
   - Navigate to the chat page in your application
   - The chat bot should be available and functional

2. **Chat Features**:
   - Ask questions about Mangystau region tourism
   - Get information about places, tours, and cultural sites
   - The bot responds in the same language you use (Russian, Kazakh, or English)
   - Conversation context is maintained for better responses

3. **Troubleshooting**:
   - If the chat bot doesn't respond, check:
     - That both servers are running
     - That your API key is valid
     - That you have internet connectivity
     - Check the browser console for any errors

## How It Works

The chat bot uses Google's Gemini API through a local proxy server:
1. User messages are sent to the local proxy server
2. The proxy server forwards requests to Gemini API
3. Responses are returned to the user through the proxy
4. All communication is queued to prevent API rate limiting

The bot is specifically trained to provide tourism information about the Mangystau region in Kazakhstan.