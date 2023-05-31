import { FastifyInstance } from 'fastify'
import { register } from '../controllers/register'
import { authenticate } from '../controllers/authenticate'

export async function appRoutes(app: FastifyInstance) {
  // users routes
  app.post('/users', register)

  // authenticate routes
  app.post('/sessions', authenticate)
}
