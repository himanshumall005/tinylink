import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('⚠️  DATABASE_URL is not set in environment variables')
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Test connection on initialization in production
if (process.env.NODE_ENV === 'production') {
  prisma.$connect().catch((error) => {
    console.error('❌ Failed to connect to database:', error.message)
    console.error('Make sure DATABASE_URL is set correctly in Vercel environment variables')
  })
}

