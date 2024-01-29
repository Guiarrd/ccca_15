import AccountDAO, { AccountDAODataBase } from "./AccountDAO";

export default class GetAccount {

	constructor (readonly accountDAO: AccountDAO) {}

	async execute(accountId: string) {
		return await this.accountDAO.getById(accountId);
	}
}

export async function getAccount(accountId: string): Promise<any> {
	
}
