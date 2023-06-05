import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { fakerPT_PT as faker } from '@faker-js/faker'
import { GetUserProfileService } from './get-user-profile'
import { ResourceNotFoundError } from './erros/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileService

describe('User Profile Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileService(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const password = faker.internet.password()

    const user = await usersRepository.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password_hash: await hash(password, 6),
    })

    const { user: userProfile } = await sut.execute({
      userId: user.id,
    })

    expect(userProfile.id).toEqual(expect.any(String))
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: '1234',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
