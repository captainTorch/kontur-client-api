import { TransactionStatus } from './TransactionStatus';

/**
 * Платеж
 */
export type Transaction = {
	/**
	 * Уникальный идентификатор платежа. Зависит от использованного платежного шлюза
	 */
	id: string,
	/**
	 * Уникальный идентификатор клиента
	 */
	clientId: number,
	/**
	 * Сумма платежа
	 */
	amount: number,
	/**
	 * Валюта платежа (RUB по умолчанию)
	 */
	currency: string,
	/**
	 * Текущий статус платежа. См. {@link TransactionStatus}
	 */
	status: TransactionStatus,
	/**
	 * Дата создания платежа
	 */
	date: Date
}
