import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymService } from './search-gym'
import { beforeEach, describe, it, expect } from 'vitest'
import { faker } from '@faker-js/faker/locale/pt_PT'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymService

describe('Search gym Service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymService(gymsRepository)
  })

  it('should be able to search gym by title', async () => {
    await gymsRepository.create({
      title: 'scorpusfit',
      description: faker.company.catchPhrase(),
      phone: faker.phone.number('+351 #########'),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    })

    await gymsRepository.create({
      title: 'dreamgym',
      description: faker.company.catchPhrase(),
      phone: faker.phone.number('+351 #########'),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    })

    const { gyms } = await sut.execute({ query: 'scor', page: 1 })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'scorpusfit' })])
  })
})
