import { Elysia } from 'elysia'
import { z } from 'zod'

export const zod = new Elysia({
	tags: ['zod']
}).post('/', ({ body }) => body, {
	body: z.object({
		name: z.literal('Lilith').describe('thing')
	}),
	response: {
		418: z.object({
			error: z.literal("I'm a teapot")
		})
	},
	detail: {
		description:
			'This endpoint use Zod to define 418 response but 200 is generated from types'
	}
})
