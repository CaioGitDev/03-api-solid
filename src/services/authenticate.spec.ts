import { expect, describe, it } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { fakerPT_PT as faker } from '@faker-js/faker'
import { AuthenticateServer } from './authenticate'
import { InvalidCredentialsError } from './erros/invalid-credentials-error'

describe('Authenticate Service', () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateServer(usersRepository)

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
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateServer(usersRepository)

    const email = faker.internet.email()
    const password = faker.internet.password()

    expect(() =>
      sut.execute({
        email,
        password,
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateServer(usersRepository)

    const email = faker.internet.email()
    const password = faker.internet.password()

    await usersRepository.create({
      name: faker.person.fullName(),
      email,
      password_hash: await hash(password, 6),
    })

    expect(() =>
      sut.execute({
        email,
        password: faker.internet.password(),
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
