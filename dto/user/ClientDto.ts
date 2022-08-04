import { UserDto } from "./UserDto";

export interface ClientDto extends UserDto {
	firstName: string;
	lastName: string;
	phone: string;
	email: string | null;
	card: string;
}
