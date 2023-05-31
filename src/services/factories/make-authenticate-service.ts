import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateServer } from '../authenticate'

export function makeAuthenticateService() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const authenticateService = new AuthenticateServer(prismaUsersRepository)

  return authenticateService
}
