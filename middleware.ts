import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip if it's an API route, static file, or known routes
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/code') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/healthz') ||
    pathname === '/' ||
    pathname.includes('.') ||
    pathname.match(/^\/[a-zA-Z0-9]{6,8}$/) === null // Only match valid shortcode format
  ) {
    return NextResponse.next()
  }

  // Extract the code (remove leading /)
  const code = pathname.slice(1)

  // Validate code format (6-8 alphanumeric characters)
  if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
    return NextResponse.next()
  }

  try {
    // Dynamically import Prisma to avoid issues in middleware
    const { prisma } = await import('@/lib/prisma')

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
    console.error('Middleware redirect error:', error)

    // Better error handling
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

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - code (stats pages)
     * - healthz (health check)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|code|healthz).*)',
  ],
}

