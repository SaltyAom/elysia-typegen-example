import { Elysia, t } from 'elysia'

import { createInsertSchema } from 'drizzle-typebox'
import { and, eq } from 'drizzle-orm'

import { db } from '../libs/db'
import { schema } from '../libs/schema'

const createUser = createInsertSchema(schema.users)
const createPost = createInsertSchema(schema.posts)

const mutateUser = t.Omit(createUser, ['id', 'createdAt'])
const mutatePost = t.Omit(createPost, [
	'id',
	'userId',
	'createdAt',
	'updatedAt'
])

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
	.get('', async ({ params: { userId }, status }) => {
		const user = await db.query.users.findFirst({
			where: eq(schema.users.id, userId),
			with: {
				posts: true
			}
		})

		if (user) return user

		return status(404)
	})
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
	.get('', async ({ params: { userId }, status }) => {
		const post = await db.query.posts.findFirst({
			where: eq(schema.posts.userId, userId)
		})

		if (post) return post

		return status(404)
	})
	.patch(
		'',
		({ body, params: { userId } }) =>
			db
				.update(schema.posts)
				.set({
					...body,
					updatedAt: Date.now()
				})
				.where(eq(schema.posts.userId, userId))
				.returning(),
		{
			body: t.Partial(mutatePost)
		}
	)
	.delete('', ({ params: { userId } }) =>
		db
			.delete(schema.posts)
			.where(
				and(
					eq(schema.posts.userId, userId),
					eq(schema.posts.id, userId)
				)
			)
			.returning()
	)

export const User = new Elysia().use([user, userId, userIdNote, userIdNoteId])
