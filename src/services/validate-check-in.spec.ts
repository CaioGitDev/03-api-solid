import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInService } from './validate-check-in'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from './erros/resource-not-found-error'

let checkInRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInService

describe('Validade Check In Service', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInService(checkInRepository)
  })

  it('should be able to validade check in', async () => {
    const checkIn = await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn: checkInValidade } = await sut.execute({
      checkInId: checkIn.id,
    })

    expect(checkInValidade.validated_at).toEqual(expect.any(Date))
    expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validade an inexistent check in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'invalid-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
