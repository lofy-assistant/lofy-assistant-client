import { PrismaClient } from './generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import type { Mongoose } from 'mongoose'
import mongoose from 'mongoose'

declare global {
  var prisma: PrismaClient | undefined
  var pool: Pool | undefined
  var mongoose: {
    conn: Mongoose | null
    promise: Promise<Mongoose> | null
  }
}

// Validate environment variables
const DATABASE_URL = process.env.DATABASE_URL as string
const MONGODB_URI = process.env.MONGODB_URI as string

if (!DATABASE_URL) {
  throw new Error('Please define the DATABASE_URL environment variable')
}

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

// PostgreSQL with Prisma
const pool = global.pool ?? new Pool({ connectionString: DATABASE_URL })
const adapter = new PrismaPg(pool)

export const prisma =
  global.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

// MongoDB with Mongoose
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectMongo() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then(() => {
      console.log('✅ MongoDB connected successfully')
      return mongoose
    }).catch((error) => {
      console.error('❌ MongoDB connection error:', error)
      cached.promise = null
      throw error
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

// Cache in development
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
  global.pool = pool
}

// Export utility to check all connections
export async function ensureDbConnections() {
  await connectMongo()
  await prisma.$connect()
  console.log('✅ All database connections ready')
}