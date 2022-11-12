import { User } from "./User";

export type Client = User & {
	firstName: string;
	lastName: string;
	phone: string;
	email: string | null;
	card: string;
}
