import { expect, describe, it } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { fakerPT_PT as faker } from '@faker-js/faker'
import { UserAlreadyExistsError } from './erros/user-already-exists-error'

describe('Register Service', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepository)

    const fakeUserCreate = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }

    const { user } = await registerService.execute(fakeUserCreate)

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upo registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepository)

    const fakeUserCreate = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }

    const { user } = await registerService.execute(fakeUserCreate)

    const isPasswordCorrectlyHashed = await compare(
      fakeUserCreate.password,
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepository)

    const fakeUserCreate = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }

    await registerService.execute(fakeUserCreate)

    expect(() =>
      registerService.execute(fakeUserCreate),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
