import { LoyaltyProgramRuleType } from "./LoyaltyProgramRuleType";

export type LoyaltyProgramRule = {
  id: number,
  type: LoyaltyProgramRuleType,
  min: number,
  max?: number,
  value: number
}