import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import AccountDAO, { AccountDAODataBase } from "./AccountDAO";
import MailerGateway from "./MailerGateway";

export default class Signup {

	constructor (readonly accountDAO: AccountDAO) {}

	async execute (input: any) {
		input.accountId = crypto.randomUUID();
		const existingAccount = await this.accountDAO.getByEmail(input.email);
		if (existingAccount) throw new Error("Account already exists");
		if (isInvalidName(input.name)) throw new Error("Invalid name");
		if (isInvalidEmail(input.email)) throw new Error("Invalid email");
		if (isInvalidCPF(input.cpf)) throw new Error("Invalid cpf");
		if (input.isDriver && isInvalidCarPlate(input.carPlate)) throw new Error("Invalid car plate");
		await this.accountDAO.save(input);
		const mailerGateway = new MailerGateway();
		mailerGateway.send("Welcome", input.email, "Use this link to activate your account.")
		return {
			accountId: input.accountId
		};
	}
}

function isInvalidName(name: string) {
	return !name.match(/[a-zA-Z] [a-zA-Z]+/);
}

function isInvalidEmail(email: string) {
	return !email.match(/^(.+)@(.+)$/);
}

function isInvalidCPF(cpf: string) {
	return !validateCpf(cpf);
}

function isInvalidCarPlate(carPlate: string) {
	return !carPlate.match(/[A-Z]{3}[0-9]{4}/);
}