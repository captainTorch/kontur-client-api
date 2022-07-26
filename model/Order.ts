import { Service } from './Service';

export interface Order {
  id: number;
  amount: number;
  services: Service[];
  paymentDate: Date;
}
