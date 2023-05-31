import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateServer } from '@/services/authenticate'
import { InvalidCredentialsError } from '@/services/erros/invalid-credentials-error'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const authenticateUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateUserSchema.parse(request.body)

  try {
    const prismaUsersRepository = new PrismaUsersRepository()
    const authenticateService = new AuthenticateServer(prismaUsersRepository)

    await authenticateService.execute({
      email,
      password,
    })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: error.message })
    }

    throw error
  }

  return reply.status(200).send()
}
