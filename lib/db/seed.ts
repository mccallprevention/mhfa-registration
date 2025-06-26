import { EventDatabase } from './redis-client'
import { generateSampleEvents } from '@/lib/sample-data-generator'

export async function seedDatabaseIfEmpty(): Promise<void> {
  try {
    const existingEvents = await EventDatabase.getAllEvents()
    
    if (existingEvents.length === 0) {
      const sampleEvents = generateSampleEvents()
      await EventDatabase.seedDatabase(sampleEvents)
      console.log(`✅ Database seeded with ${sampleEvents.length} events`)
    } else {
      console.log(`ℹ️ Database already contains ${existingEvents.length} events`)
    }
  } catch (error) {
    console.error('❌ Failed to seed database:', error)
    throw error
  }
}