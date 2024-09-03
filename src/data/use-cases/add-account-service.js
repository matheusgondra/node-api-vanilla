export class AddAccountService {
	#addAccountRepository;

	constructor({ addAccountRepository }) {
		this.#addAccountRepository = addAccountRepository;
	}

	async add(account) {
		await this.#addAccountRepository.add(account);
	}
}