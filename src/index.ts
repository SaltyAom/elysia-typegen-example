import { Elysia, redirect } from 'elysia'
import { openapi } from '@elysiajs/openapi'
import { fromTypes } from '@elysiajs/openapi/gen'
import { z } from 'zod'

import { User } from './modules/user'
import { complex } from './modules/complex'
import { zod } from './modules/zod'

export const app = new Elysia()
	.get('/', redirect('/openapi'), {
		detail: {
			hide: true
		}
	})
	.use(
		openapi({
			references: fromTypes('src/index.ts'),
			documentation: {
				info: {
					title: 'Elysia TypeGen Example',
					version: '1.0.0',
					description: 'All response here generated from types'
				}
			},
			mapJsonSchema: {
				zod: z.toJSONSchema
			}
		})
	)
	.use(User)
	.use(zod)
	.use(complex)
	.listen(3000)

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
