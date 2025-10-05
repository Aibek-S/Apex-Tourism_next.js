import { NextRequest } from 'next/server';

export async function GET() {
  return new Response(JSON.stringify({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    platform: 'Next.js API Route'
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