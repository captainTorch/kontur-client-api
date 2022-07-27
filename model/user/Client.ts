import { User } from "./User";

export interface Client extends User {
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
}
