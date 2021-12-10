import { rest } from 'msw'

export const handlers = [
  rest.post<any>('/api/form', (_req, res, ctx) => {
    return res(ctx.status(200))
  }),
  rest.post<{ username: string; password: string }>('/api/login', (req, res, ctx) => {
    const { username, password } = req.body
    if (username === 'username' && password === 'password') {
      return res(
        ctx.json({
          token: 'f79e82e8-c34a-4dc7-a49e-9fadc0979fda',
          username,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@vaisala.com',
        })
      )
    } else {
      return res(
        ctx.status(401),
        ctx.json({
          error: `The username and password combination are invalid`,
        })
      )
    }
  }),
  rest.post<{ token: string }>('/api/refresh', (req, res, ctx) => {
    const { token } = req.body
    if (token) {
      return res(
        ctx.json({
          token: 'f79e82e8-c34a-4dc7-a49e-9fadc0979fda',
          username: 'username',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@vaisala.com',
        })
      )
    } else {
      return res(
        ctx.status(401),
        ctx.json({
          error: `The token is invalid`,
        })
      )
    }
  }),
]
