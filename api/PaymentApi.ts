import { Api } from './Api'

export type PaymentParams = {
  amount: number,
  currency: string,
  accountId: string
  callbackUrl: string
}

export type PaymentResponse = {
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
   * @param {PaymentParams} params данные о карте и платеже
   * @param {string} paymentGateId ID платежного шлюза
   * @returns {Promise<PaymentResponse>} URL для перенаправления на платежный шлюз
   */
  pay (params: PaymentParams, paymentGateId: string): Promise<PaymentResponse> {
      return this.post(`/refill-card/${paymentGateId}`, params) as Promise<PaymentResponse>
  }
}
