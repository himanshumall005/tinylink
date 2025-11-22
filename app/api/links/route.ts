import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createLinkSchema } from '@/lib/validations'
import { generateShortcode } from '@/lib/utils'

/**
 * POST /api/links
 * Creates a new short link
 */
export async function POST(request: NextRequest) {
  try {
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
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error creating link:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
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

