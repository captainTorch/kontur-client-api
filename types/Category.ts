import { Service } from './Service';

export type Category = {
	id: number,
	name: string,
	categories: Category[],
	services: Service[]
}
