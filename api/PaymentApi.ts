import { Api } from './Api'
import { KonturAccountTransaction } from "../types";

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

  /**
   * Возвращает транзакцию по идентификатору
   *
   * @param {string} transactionId идентификатор
   * @returns {Promise<KonturAccountTransaction>} транзакция
   */
  getTransaction (transactionId: string): Promise<KonturAccountTransaction> {
    return this.get(`/transaction/${transactionId}`) as Promise<KonturAccountTransaction>
  }
}
