import { ServiceDto } from './ServiceDto';

export type CategoryDto = {
	id: number,
	name: string,
	categories: CategoryDto[],
	services: ServiceDto[]
}
