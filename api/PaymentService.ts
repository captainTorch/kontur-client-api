import { ApiService } from './ApiService'
import { TransactionDto } from '../dto'

export type RefillCardResponse = {
  url: string
}

export class PaymentService extends ApiService {
  module = '/payment';

  refillCard (
    amount: number,
    paymentGateId: string,
    callbackUrl: string = `http://${location.host}`
  ): Promise<RefillCardResponse> {
      return this.post(`/refill-card/${paymentGateId}`, { amount, callbackUrl }) as Promise<RefillCardResponse>
  }

  getTransaction (transactionId: string): Promise<TransactionDto> {
      return this.get(`/transaction/${transactionId}`) as Promise<TransactionDto>
  }
}
