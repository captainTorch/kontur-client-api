import { Api } from './Api'

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
   * @param {number} amount сумма пополнения
   * @param {string} paymentGateId платежного шлюза
   * @param {string} callbackUrl URL для перехода после платежа
   * @returns {Promise} HTTP response
   */
  refillCard (
    amount: number,
    paymentGateId: string,
    callbackUrl = `http://${location.host}`
  ): Promise<RefillCardResponse> {
      return this.post(`/refill-card/${paymentGateId}`, { amount, callbackUrl }) as Promise<RefillCardResponse>
  }
}
