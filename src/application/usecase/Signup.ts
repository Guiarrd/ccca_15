import crypto from "crypto";
import { validateCpf } from "../../domain/validateCpf";
import AccountRepository from "../../infrastructure/repository/AccountRepository";
import MailerGateway from "../../infrastructure/gateway/MailerGateway";
import Account from "../../domain/Account";

export default class Signup {

	constructor (readonly accountRepository: AccountRepository, readonly mailerGateway: MailerGateway) {}

	async execute (input: any) {
		input.accountId = crypto.randomUUID();
		const existingAccount = await this.accountRepository.getByEmail(input.email);
		if (existingAccount) throw new Error("Account already exists");
		const account = Account.create(input.name, input.email, input.cpf, input.isPassenger, input.isDriver, input.carPlate);
		await this.accountRepository.save(account);
		this.mailerGateway.send("Welcome", account.email, "Use this link to activate your account.")
		return {
			accountId: account.accountId
		};
	}
}