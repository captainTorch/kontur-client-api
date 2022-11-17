import { User } from './User';
import { Gender } from './common/Gender';

export type Client = User & {
	firstName: string;
	lastName: string;
	phone: string;
	email?: string;
	gender?: Gender
}
