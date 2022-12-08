/**
 * Текущий статус платежа
 */
export const enum TransactionStatus {
  /**
   * Статус по умолчанию при создании платежа
   */
  CREATED = 'CREATED',
  /**
   * Производится запрос платежного шлюза
   */
  AWAITING_FOR_PAYMENT_GATE = 'PG_AWAITING',
  /**
   * Устанавливается по умолчанию при создании платежа.
   */
  APPROVED_BY_PAYMENT_GATE = 'PG_APPROVED',
  /**
   * Платеж успешно проведен платежным шлюзом, средства списаны со счета клиента
   */
  COMPLETED_BY_PAYMENT_GATE = 'PG_COMPLETED',
  /**
   * Произведена отмена операции продавцом
   */
  REVERSED_BY_PAYMENT_GATE = 'PG_REVERSED',
  /**
   * Произведен возврат средств клиенту
   */
  REFUNDED_BY_PAYMENT_GATE = 'PG_REFUNDED',
  /**
   * Платеж отклонен платежным шлюзом
   */
  REJECTED_BY_PAYMENT_GATE = 'PG_REJECTED',
  /**
   * Устанавливается после успешной обработки платежа платежным шлюзом,
   * перед началом процесса обработки платежа системой Контур
   */
  AWAITING_FOR_KONTUR = 'KONTUR_AWAITING',
  /**
   * Устанавливается в случае неудачной обработки платежа системой Контур
   */
  REJECTED_BY_KONTUR = 'KONTUR_REJECTED',
  /**
   * Средства списаны с карты клиента, счет клиента в системе Контур пополнен
   */
  COMPLETED = 'COMPLETED',
  /**
   * Операция прервана клиентом либо отклонена по таймауту
   */
  ABORTED = 'ABORTED'
}