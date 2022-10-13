import { Api } from './Api'
import { TransactionDto } from '../dto'

export type RefillCardResponse = {
  url: string
}

export class PaymentApi extends Api {
  module = '/payment';

  refillCard (
    amount: number,
    paymentGateId: string,
    callbackUrl = `http://${location.host}`
  ): Promise<RefillCardResponse> {
      return this.post(`/refill-card/${paymentGateId}`, { amount, callbackUrl }) as Promise<RefillCardResponse>
  }

  getTransaction (transactionId: string): Promise<TransactionDto> {
      return this.get(`/transaction/${transactionId}`) as Promise<TransactionDto>
  }
}
