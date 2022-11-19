import { Api } from './Api'

export type RefillCardParams = {
  amount: number,
  currency: string,
  accountId: string
  callbackUrl: string
}

export type RefillCardResponse = {
  url: string
}

/**
 * Содержит методы для пополнения карт и получения информации о платежах
 */
export class PaymentApi extends Api {
  module = '/payment';

  /**
   * Пополняет карту клиента на указанную сумму (в рублях)
   *
   * @param {RefillCardParams} params данные о карте и платеже
   * @param {string} paymentGateId ID платежного шлюза
   * @returns {Promise} HTTP response
   */
  refillCard (params: RefillCardParams, paymentGateId: string): Promise<RefillCardResponse> {
      return this.post(`/refill-card/${paymentGateId}`, params) as Promise<RefillCardResponse>
  }
}
