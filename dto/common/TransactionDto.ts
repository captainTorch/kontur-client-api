import { TransactionStatus } from './TransactionStatus';

export type TransactionDto = {
	id: string,
	clientId: number,
	amount: number,
	currency: string,
	status: TransactionStatus,
	date: Date
}
