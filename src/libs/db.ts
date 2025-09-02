import { drizzle } from 'drizzle-orm/bun-sqlite'
import { schema } from './schema'

export const db = drizzle(process.env.DATABASE_URL!, {
	schema
})
