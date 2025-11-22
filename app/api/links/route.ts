import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createLinkSchema } from '@/lib/validations'
import { generateShortcode } from '@/lib/utils'

// Route segment config - ensures this route is handled correctly on Vercel
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST /api/links
 * Creates a new short link
 */
export async function POST(request: NextRequest) {
  try {
    // Check if Prisma Client is available
    if (!prisma) {
      console.error('Prisma Client is not initialized')
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const validated = createLinkSchema.parse(body)

    // Generate code if not provided
    let code = validated.code || generateShortcode()

    // Ensure code is unique
    let attempts = 0
    while (attempts < 10) {
      const existing = await prisma.link.findUnique({
        where: { code },
      })

      if (!existing) {
        break
      }

      // If custom code exists, return 409
      if (validated.code) {
        return NextResponse.json(
          { error: 'Code already exists' },
          { status: 409 }
        )
      }

      // Generate new code if auto-generated one exists
      code = generateShortcode()
      attempts++
    }

    if (attempts >= 10) {
      return NextResponse.json(
        { error: 'Failed to generate unique code' },
        { status: 500 }
      )
    }

    const link = await prisma.link.create({
      data: {
        code,
        url: validated.url,
      },
    })

    return NextResponse.json(link, { status: 201 })
  } catch (error: any) {
    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    // Handle Prisma connection errors
    if (error.code === 'P1001' || error.message?.includes('Can\'t reach database')) {
      console.error('Database connection error:', error)
      return NextResponse.json(
        { error: 'Database connection failed. Please check your DATABASE_URL.' },
        { status: 503 }
      )
    }

    // Handle Prisma Client not generated errors
    if (error.message?.includes('PrismaClient') || error.message?.includes('@prisma/client')) {
      console.error('Prisma Client error:', error)
      return NextResponse.json(
        { error: 'Database client not initialized. Please check build logs.' },
        { status: 503 }
      )
    }

    console.error('Error creating link:', error)
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack,
    })

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/links
 * Lists all links
 */
export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(links)
  } catch (error) {
    console.error('Error fetching links:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

