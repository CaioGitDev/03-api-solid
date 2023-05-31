import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { fakerPT_PT as faker } from '@faker-js/faker'
import { UserAlreadyExistsError } from './erros/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterService

describe('Register Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterService(usersRepository)
  })

  it('should be able to register', async () => {
    const fakeUserCreate = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }

    const { user } = await sut.execute(fakeUserCreate)

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upo registration', async () => {
    const fakeUserCreate = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }

    const { user } = await sut.execute(fakeUserCreate)

    const isPasswordCorrectlyHashed = await compare(
      fakeUserCreate.password,
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const fakeUserCreate = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }

    await sut.execute(fakeUserCreate)

    await expect(() => sut.execute(fakeUserCreate)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    )
  })
})
