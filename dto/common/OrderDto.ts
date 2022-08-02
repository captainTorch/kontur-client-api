import { ServiceDto } from '../service/ServiceDto';

export interface OrderDto {
  id: number;
  amount: number;
  services: ServiceDto[];
  paymentDate: Date;
}
