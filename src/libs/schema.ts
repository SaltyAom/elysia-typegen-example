import { relations } from 'drizzle-orm'
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull().unique(),
	bio: text(),
	createdAt: int()
		.notNull()
		.$defaultFn(() => Date.now())
})

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts)
}))

export const posts = sqliteTable('posts', {
	id: int().primaryKey({ autoIncrement: true }),
	userId: int()
		.notNull()
		.references(() => users.id),
	title: text().notNull(),
	content: text().notNull(),
	createdAt: int()
		.notNull()
		.$defaultFn(() => Date.now()),
	updatedAt: int()
		.notNull()
		.$defaultFn(() => Date.now())
})

export const postsRelations = relations(posts, ({ one }) => ({
	user: one(users, {
		fields: [posts.userId],
		references: [users.id]
	})
}))

export const schema = { users, usersRelations, posts, postsRelations } as const
export type schema = typeof schema
