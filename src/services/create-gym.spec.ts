import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymService } from './create-gym'
import { beforeEach, describe, expect, it } from 'vitest'
import { faker } from '@faker-js/faker/locale/pt_PT'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymService

describe('Create gym Service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymService(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: faker.company.name(),
      description: faker.company.catchPhrase(),
      phone: faker.phone.number('+351 #########'),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
