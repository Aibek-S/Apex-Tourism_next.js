import { NextRequest } from 'next/server';

export async function GET() {
  // Check if required environment variables are set
  const hasApiKey = !!(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  
  return new Response(JSON.stringify({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    platform: 'Next.js API Route',
    hasApiKey
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST() {
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
}