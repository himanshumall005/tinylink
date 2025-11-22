import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Route segment config - ensures this route is handled correctly on Vercel
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const runtime = 'nodejs'
export const fetchCache = 'force-no-store'


/**
 * GET /:code
 * Redirects to the original URL (302) or returns 404 if deleted
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> | { code: string } }
) {
  try {
    const { code } = await Promise.resolve(params)

    // Validate code format
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    }

    const link = await prisma.link.findUnique({
      where: { code },
    })

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    // Update clicks and lastClicked
    await prisma.link.update({
      where: { code },
      data: {
        clicks: { increment: 1 },
        lastClicked: new Date(),
      },
    })

    // Return 302 redirect
    return NextResponse.redirect(link.url, { status: 302 })
  } catch (error) {
    console.error('Error redirecting:', error)

    // Better error handling for database connection issues
    if (error instanceof Error) {
      if (error.message.includes('PrismaClient') || error.message.includes('DATABASE_URL')) {
        return NextResponse.json(
          { error: 'Database connection error' },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

