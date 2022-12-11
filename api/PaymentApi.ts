import { Api } from './Api'
import { KonturAccountTransaction } from "../types";

export const enum PaymentCommand {
  INITIALIZE = 'initialize',
  CONFIRM = 'confirm',
  ABORT = 'abort'
}

export type PaymentFormRequestParams = {
  amount: number,
  currency: string,
  accountId: string
  callbackUrl: string
}

export type PaymentFormRequestResponse = {
  url: string
}

/**
 * Содержит методы для пополнения карт и получения информации о платежах
 */
export class PaymentApi extends Api {
  path = '/payment';

  /**
   * Пополняет карту клиента на указанную сумму (в рублях)
   *
   * @param {PaymentFormRequestParams} params данные о карте и платеже
   * @param {string} paymentGateId ID платежного шлюза
   * @returns {Promise<PaymentFormRequestResponse>} URL для перенаправления на платежный шлюз
   */
  requestPaymentForm (params: PaymentFormRequestParams, paymentGateId: string): Promise<PaymentFormRequestResponse> {
      return this.post(`/request-payment-form/${paymentGateId}`, params) as Promise<PaymentFormRequestResponse>
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
