import AccountDAO, { AccountDAODataBase } from "./AccountDAO";

export default class GetAccount {

	constructor (readonly accountDAO: AccountDAO) {}

	async execute(accountId: string) {
		const accountDAO = new AccountDAODataBase();
		return await accountDAO.getById(accountId);
	}
}

export async function getAccount(accountId: string): Promise<any> {
	
}
