import { Api } from "./Api";
import { LoyaltyProgramRule } from "../types";

/**
 *
 */
export class LoyaltyProgramApi extends Api {
  protected path = '/loyalty';

  /**
   * Возвращает настроенные правила начисления бонусной валюты
   *
   * @returns {Promise<LoyaltyProgramRule[]>} Список правил
   */
  public getRules(): Promise<LoyaltyProgramRule[]> {
    return this.get('/rules') as Promise<LoyaltyProgramRule[]>
  }

  /**
   * Возвращает бонусную сумму, соответствующую данной сумме пополнения
   *
   * @param {number} amount Сумма, для которой высчитывается бонусная сумма
   * @returns {Promise<number>} Бонусная сумма
   */
  public calculateBonusAmount(amount: number): Promise<number> {
    return this.post('/calc', { amount }) as Promise<number>
  }
}