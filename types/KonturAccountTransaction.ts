import { TransactionStatus } from "./TransactionStatus";

export type KonturAccountTransaction = {
  id?: string,
  konturId?: string,
  paymentGateId?: string,

  date: Date,
  amount: number,
  status: TransactionStatus
}