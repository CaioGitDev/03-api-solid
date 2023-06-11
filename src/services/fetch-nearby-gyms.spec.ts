import { FetchNearbyGymsService } from './fetch-nearby-gyms'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { faker } from '@faker-js/faker/locale/pt_PT'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsService

describe('Fetch nearby gyms service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsService(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      id: 'gym-01',
      title: faker.company.name(),
      description: faker.company.catchPhraseDescriptor(),
      phone: faker.phone.number('+351 #########'),
      latitude: 39.022182,
      longitude: -8.7931455,
    })
    await gymsRepository.create({
      id: 'gym-02',
      title: faker.company.name(),
      description: faker.company.catchPhraseDescriptor(),
      phone: faker.phone.number('+351 #########'),
      latitude: 38.9766027,
      longitude: -8.810892,
    })

    await gymsRepository.create({
      title: faker.company.name(),
      description: faker.company.catchPhrase(),
      phone: faker.phone.number('+351 #########'),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    })

    const { gyms } = await sut.execute({
      userLatitude: 39.0239034,
      userLongitude: -8.7920232,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ id: 'gym-01' }),
      expect.objectContaining({ id: 'gym-02' }),
    ])
  })
})
