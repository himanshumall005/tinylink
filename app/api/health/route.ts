import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/health
 * Detailed health check with database connection test
 */
export async function GET() {
  const health = {
    ok: true,
    version: '1.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {
      database: 'unknown' as 'ok' | 'error' | 'unknown',
      prismaClient: 'unknown' as 'ok' | 'error' | 'unknown',
      databaseUrl: !!process.env.DATABASE_URL,
    },
    errors: [] as string[],
  }

  // Check if Prisma Client is available
  if (!prisma) {
    health.checks.prismaClient = 'error'
    health.errors.push('Prisma Client is not initialized')
    health.ok = false
  } else {
    health.checks.prismaClient = 'ok'
  }

  // Check DATABASE_URL
  if (!process.env.DATABASE_URL) {
    health.errors.push('DATABASE_URL environment variable is not set')
    health.ok = false
  }

  // Test database connection
  if (prisma && process.env.DATABASE_URL) {
    try {
      await prisma.$queryRaw`SELECT 1`
      health.checks.database = 'ok'
    } catch (error: any) {
      health.checks.database = 'error'
      health.errors.push(`Database connection failed: ${error.message}`)
      health.ok = false
    }
  } else {
    health.checks.database = 'error'
    if (!prisma) {
      health.errors.push('Cannot test database: Prisma Client not available')
    }
    if (!process.env.DATABASE_URL) {
      health.errors.push('Cannot test database: DATABASE_URL not set')
    }
  }

  return NextResponse.json(health, {
    status: health.ok ? 200 : 503,
  })
}

