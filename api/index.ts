import { ClientService } from './ClientService';
import { PaymentService } from './PaymentService';
import { ServicesService } from './ServicesService';

export default class {

	public clientService: ClientService;
	public paymentService: PaymentService;
	public servicesService: ServicesService;

	constructor(host: string) {
		this.clientService = new ClientService(host)
		this.paymentService = new PaymentService(host)
		this.servicesService = new ServicesService(host)
	}

}
