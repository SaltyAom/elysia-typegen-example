import { Elysia, t } from 'elysia'

export const complex = new Elysia()
	.macro({
		auth: {
			response: {
				409: t.Literal('Conflict')
			},
			body: t.Object({
				authorization: t.String()
			}),
			beforeHandle({ status }) {
				if (Math.random() < 0.05) return status(410)
			},
			resolve: () => ({ a: 'a' as const })
		}
	})
	.onError(({ status }) => {
		if (Math.random() < 0.05) return status(400)
	})
	.resolve(({ status }) => {
		if (Math.random() < 0.05) return status(401)

		return {
			b: 'b' as const
		}
	})
	.onBeforeHandle([
		({ status }) => {
			if (Math.random() < 0.05) return status(402)
		},
		({ status }) => {
			if (Math.random() < 0.05) return status(403)
			if (Math.random() < 0.05) return 'vibe check' as const
		}
	])
	.guard({
		beforeHandle: [
			({ status }) => {
				if (Math.random() < 0.05) return status(405)
			},
			({ status }) => {
				if (Math.random() < 0.05) return status(406)
			}
		],
		afterHandle({ status }) {
			if (Math.random() < 0.05) return status(407)
		},
		error({ status }) {
			if (Math.random() < 0.05) return status(408)
		}
	})
	.post(
		'/complex',
		({ body, status, a, b }) => {
			if (Math.random() < 0.05) return status(409, 'Conflict')

			return 'Type Soundness'
		},
		{
			auth: true,
			response: {
				411: t.Literal('Length Required')
			},
			tags: ['complex'],
			detail: {
				description:
					'This is a complex endpoint with multiple layers of middleware response'
			}
		}
	)
