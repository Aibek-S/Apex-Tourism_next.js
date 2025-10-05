import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Validate API key
if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  console.error('❌ NEXT_PUBLIC_GEMINI_API_KEY environment variable is not set');
  console.error('Please make sure you have a .env.local file with your Gemini API key');
  console.error('Example .env.local file:');
  console.error('NEXT_PUBLIC_GEMINI_API_KEY=your_actual_gemini_api_key_here');
  console.error('PORT=3001');
  process.exit(1);
}

// Gemini API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Call Gemini API with gemini-2.5-flash model
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
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
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🤖 Gemini API Proxy Server running on port ${PORT}`);
  console.log(`📝 POST endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔑 Using API key: ${process.env.NEXT_PUBLIC_GEMINI_API_KEY ? 'YES' : 'NO'}`);
});