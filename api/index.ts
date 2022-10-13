import { ClientApi } from './ClientApi';
import { PaymentApi } from './PaymentApi';
import { ServicesApi } from './ServicesApi';

export default class {

	public clientService: ClientApi;
	public paymentService: PaymentApi;
	public servicesService: ServicesApi;

	constructor(host: string) {
		this.clientService = new ClientApi(host)
		this.paymentService = new PaymentApi(host)
		this.servicesService = new ServicesApi(host)
	}

}
