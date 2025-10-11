import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables (try multiple possible locations)
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config(); // Also try default .env

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Gemini API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    // Check if API key is available
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'API key not configured',
        message: 'Gemini API key is missing. Please configure environment variables.'
      });
    }

    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Call Gemini API with gemini-2.5-flash model
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: message
            }]
          }]
        }),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get response from Gemini API');
    }

    // Extract the response text
    const reply = data.candidates[0]?.content?.parts[0]?.text || 'No response from Gemini';
    
    // Send response back to client
    res.json({ reply });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const hasApiKey = !!(process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY);
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    hasApiKey
  });
});

// Export the app for Vercel serverless functions
export default (req, res) => {
  // Handle the request with our express app
  return app(req, res);
};

// Only start server if not running on Vercel (for local development)
if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`🤖 Gemini API Proxy Server running on port ${PORT}`);
    console.log(`📝 POST endpoint: http://localhost:${PORT}/api/chat`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    console.log(`🔑 Using API key: ${apiKey ? 'YES' : 'NO'}`);
  });
  
  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
    });
  });
}