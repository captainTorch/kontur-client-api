import { TransactionStatus } from "./TransactionStatus";

export type KonturAccountTransaction = {
  id?: string,
  konturId?: string,
  paymentGateId?: string,

  date: Date,
  amount: number,
  currency: string,
  status: TransactionStatus

  // TODO получилось два типа для KonturAccount. Один из конвертера, второй просто сериализованный entity
  // Подумать, как избежать этой ситуации
  account?: any
}