import { KonturAccountBalance } from "./KonturAccountBalance";
import { KonturAccountCard } from "./KonturAccountCard";
import { KonturAccountTransaction } from "./KonturAccountTransaction";

export type KonturAccount = {
  id: string;
  name: string;
  isMutable: boolean,
  isRefillable: boolean,
  cards: KonturAccountCard[];
  balance: KonturAccountBalance[];
  transactions: KonturAccountTransaction[];
}