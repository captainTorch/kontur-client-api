import { PromoCodeType } from './PromoCodeType';

export interface PromoCode {
  code: string,
  valid: boolean,
  type: PromoCodeType,
  discount: number
}
