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

app.listen(3000)
