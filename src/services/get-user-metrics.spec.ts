import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsService } from './get-user-metrics'
import { beforeEach, describe, expect, it } from 'vitest'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsService

describe('Get User metrics Service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsService(checkInsRepository)
  })

  it('shuld be able to get check-ins count from metrics', async () => {
    for (let index = 1; index <= 22; index++) {
      await checkInsRepository.create({
        gym_id: `gym-${index}`,
        user_id: 'user-01',
      })
    }

    const { checkInsCount } = await sut.execute({ userId: 'user-01' })

    expect(checkInsCount).toEqual(22)
  })
})
