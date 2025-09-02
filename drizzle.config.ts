import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	out: './drizzle',
	schema: './src/libs/schema.ts',
	dialect: 'sqlite',
	dbCredentials: {
		url: process.env.DATABASE_URL!
	}
})
