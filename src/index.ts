import { Elysia, redirect } from 'elysia'
import { openapi } from '@elysiajs/openapi'
import { fromTypes } from '@elysiajs/openapi/gen'

import { User } from './modules/user'

export const app = new Elysia()
	.get('/', redirect('/openapi'), {
		detail: {
			hide: true
		}
	})
	.use(
		openapi({
			references: fromTypes('src/index.ts')
		})
	)
	.use(User)
	.listen(3000)

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
