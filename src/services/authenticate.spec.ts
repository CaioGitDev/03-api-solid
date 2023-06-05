import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { fakerPT_PT as faker } from '@faker-js/faker'
import { AuthenticateServer } from './authenticate'
import { InvalidCredentialsError } from './erros/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateServer

describe('Authenticate Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateServer(usersRepository)
  })

  it('should be able to authenticate', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()

    await usersRepository.create({
      name: faker.person.fullName(),
      email,
      password_hash: await hash(password, 6),
    })

    const { user } = await sut.execute({
      email,
      password,
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()

    await expect(() =>
      sut.execute({
        email,
        password,
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()

    await usersRepository.create({
      name: faker.person.fullName(),
      email,
      password_hash: await hash(password, 6),
    })

    await expect(() =>
      sut.execute({
        email,
        password: faker.internet.password(),
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
