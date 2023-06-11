import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from './erros/resource-not-found-error'

interface ValidateCheckInServiceRequest {
  checkInId: string
}
interface ValidateCheckInServiceResponse {
  checkIn: CheckIn
}

export class ValidateCheckInService {
  constructor(private checkinRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInServiceRequest): Promise<ValidateCheckInServiceResponse> {
    const checkIn = await this.checkinRepository.findById(checkInId)

    if (!checkIn) throw new ResourceNotFoundError()

    checkIn.validated_at = new Date()

    await this.checkinRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
