import * as types from './types'

import { ClientApi } from "./api/ClientApi";
import { PaymentApi } from "./api/PaymentApi";
import { ServicesApi } from "./api/ServicesApi";

export {types}

/**
 * Корневой класс API, контейнер для остальных сервисов.
 */
export default class {

  public clientService: ClientApi;
  public paymentService: PaymentApi;
  public servicesService: ServicesApi;

  /**
   * @param {string} host URL экземпляра kontur-client
   */
  constructor(host: string) {
    this.clientService = new ClientApi(host)
    this.paymentService = new PaymentApi(host)
    this.servicesService = new ServicesApi(host)
  }

}
