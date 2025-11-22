import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Route segment config - ensures this route is handled correctly on Vercel
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/links/:code
 * Gets stats for a specific link
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> | { code: string } }
) {
  try {
    const { code } = await Promise.resolve(params)
    const link = await prisma.link.findUnique({
      where: { code },
    })

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    return NextResponse.json(link)
  } catch (error) {
    console.error('Error fetching link:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/links/:code
 * Deletes a link
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> | { code: string } }
) {
  try {
    const { code } = await Promise.resolve(params)
    const link = await prisma.link.findUnique({
      where: { code },
    })

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    await prisma.link.delete({
      where: { code },
    })

    return NextResponse.json({ message: 'Link deleted successfully' })
  } catch (error) {
    console.error('Error deleting link:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

