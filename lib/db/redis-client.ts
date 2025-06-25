// lib/db/redis-client.ts
import { createClient, RedisClientType } from 'redis'
import type { Event } from '@/lib/types'

// Singleton Redis connection
let client: RedisClientType | null = null

async function getRedisClient(): Promise<RedisClientType> {
  if (!client) {
    client = createClient({ url: process.env.REDIS_URL })
    client.on('error', (err) => console.error('Redis Client Error:', err))
    await client.connect()
  }
  return client
}

const EVENTS_KEY = 'events'
const EVENT_COUNTER_KEY = 'event_counter'

export class EventDatabase {
  /* ----------  READ  ---------- */
  static async getAllEvents(): Promise<Event[]> {
    const redis = await getRedisClient()
    const json = await redis.get(EVENTS_KEY)
    return json ? (JSON.parse(json) as Event[]) : []
  }

  static async getEventById(id: string): Promise<Event | null> {
    const events = await this.getAllEvents()
    return events.find((e) => e.id === id) ?? null
  }

  /* ----------  CREATE  ---------- */
  static async createEvent(
    data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Event> {
    const redis = await getRedisClient()
    const events = await this.getAllEvents()
    const counter = await redis.incr(EVENT_COUNTER_KEY)

    const newEvent: Event = {
      ...data,
      id: `event_${counter}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await redis.set(EVENTS_KEY, JSON.stringify([...events, newEvent]))
    return newEvent
  }

  /* ----------  UPDATE  ---------- */
  static async updateEvent(id: string, updates: Partial<Event>): Promise<Event | null> {
    const redis = await getRedisClient()
    const events = await this.getAllEvents()
    const index = events.findIndex((e) => e.id === id)
    if (index === -1) return null

    const updated: Event = {
      ...events[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    events[index] = updated
    await redis.set(EVENTS_KEY, JSON.stringify(events))
    return updated
  }

  /* ----------  DELETE  ---------- */
  static async deleteEvent(id: string): Promise<boolean> {
    const redis = await getRedisClient()
    const events = await this.getAllEvents()
    const filtered = events.filter((e) => e.id !== id)
    if (filtered.length === events.length) return false
    await redis.set(EVENTS_KEY, JSON.stringify(filtered))
    return true
  }

  /* ----------  SEED (one-time)  ---------- */
  static async seedDatabase(initialEvents: Event[]) {
    const redis = await getRedisClient()
    const existing = await this.getAllEvents()
    if (existing.length) return
    await redis.set(EVENTS_KEY, JSON.stringify(initialEvents))
    await redis.set(EVENT_COUNTER_KEY, String(initialEvents.length))
    console.log('Database seeded with initial events')
  }
}

// Explicit export keeps TS happy in isolated-modules mode
export { getRedisClient }
