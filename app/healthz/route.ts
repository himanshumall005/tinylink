import { NextResponse } from 'next/server'

// Route segment config - ensures this route is handled correctly on Vercel
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /healthz
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({ ok: true, version: '1.0' })
}

