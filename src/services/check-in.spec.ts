import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInService } from './check-in'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { faker } from '@faker-js/faker/locale/pt_PT'
import { Decimal } from '@prisma/client/runtime'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInService

describe('Check Ins Service', () => {
  const userLatitude = 39.0239034
  const userLongitude = -8.7920232

  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInService(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: faker.company.name(),
      description: faker.company.catchPhraseDescriptor(),
      phone: faker.phone.number('+351 #########'),
      latitude: 39.022182,
      longitude: -8.7931455,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude,
      userLongitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 5, 2, 9, 33, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude,
      userLongitude,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude,
        userLongitude,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 5, 2, 9, 33, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude,
      userLongitude,
    })

    vi.setSystemTime(new Date(2023, 5, 3, 9, 33, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude,
      userLongitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    await gymsRepository.create({
      id: 'gym-02',
      title: faker.company.name(),
      description: faker.company.catchPhraseDescriptor(),
      phone: faker.phone.number('+351 #########'),
      latitude: new Decimal(38.9766027),
      longitude: new Decimal(-8.810892),
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-02',
        userLatitude,
        userLongitude,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
