import { Elysia, t } from 'elysia'

import { createInsertSchema } from 'drizzle-typebox'
import { eq } from 'drizzle-orm'

import { db } from '../libs/db'
import { schema } from '../libs/schema'

const createUser = createInsertSchema(schema.users)
const createPost = createInsertSchema(schema.posts)

const mutateUser = t.Omit(createUser, ['id', 'createdAt'])
const mutatePost = t.Omit(createPost, ['id', 'userId', 'createdAt'])

const user = new Elysia({
	prefix: '/user'
})
	.get('', () =>
		db.query.users.findMany({
			with: {
				posts: true
			}
		})
	)
	.put('', ({ body }) => db.insert(schema.users).values(body).returning(), {
		body: mutateUser
	})

const userId = new Elysia({ prefix: '/user/:userId' })
	.guard({
		params: t.Object({
			userId: t.Number()
		})
	})
	.get('', ({ params: { userId } }) =>
		db.query.users.findFirst({
			where: eq(schema.users.id, userId)
		})
	)
	.patch(
		'',
		({ body, params: { userId } }) =>
			db
				.update(schema.users)
				.set(body)
				.where(eq(schema.users.id, userId))
				.returning(),
		{
			body: t.Partial(mutateUser)
		}
	)
	.delete('', ({ params: { userId } }) =>
		db.delete(schema.users).where(eq(schema.users.id, userId)).returning()
	)

const userIdNote = new Elysia({ prefix: '/user/:userId/note' })
	.guard({
		params: t.Object({
			userId: t.Number()
		})
	})
	.get('', ({ params: { userId } }) =>
		db.select().from(schema.posts).where(eq(schema.posts.userId, userId))
	)
	.put(
		'',
		({ body, params: { userId } }) =>
			db
				.insert(schema.posts)
				.values({
					...body,
					updatedAt: Date.now(),
					userId
				})
				.returning(),
		{
			body: mutatePost
		}
	)

const userIdNoteId = new Elysia({
	prefix: '/user/:userId/note/:noteId'
})
	.guard({
		params: t.Object({
			userId: t.Number(),
			noteId: t.Number()
		})
	})
	.get('', ({ params: { userId } }) =>
		db.query.posts.findFirst({
			where: eq(schema.posts.userId, userId)
		})
	)
	.patch(
		'',
		({ body, params: { userId } }) =>
			db
				.update(schema.posts)
				.set({
					...body,
					updatedAt: Date.now()
				})
				.where(eq(schema.posts.userId, userId)),
		{
			body: t.Partial(mutateUser)
		}
	)
	.delete('', ({ params: { userId } }) =>
		db
			.delete(schema.posts)
			.where(eq(schema.posts.userId, userId))
			.returning()
	)

export const User = new Elysia().use([user, userId, userIdNote, userIdNoteId])
