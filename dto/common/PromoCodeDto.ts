import { PromoCodeType } from './PromoCodeType';

export interface PromoCodeDto {
  code: string,
  valid: boolean,
  type: PromoCodeType,
  discount: number
}
