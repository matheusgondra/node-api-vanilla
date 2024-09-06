export class AddAccountService {
	#addAccountRepository;
	#encrypter;

	constructor({ addAccountRepository, encrypter }) {
		this.#addAccountRepository = addAccountRepository;
		this.#encrypter = encrypter;
	}

	async add(account) {
		await this.#encrypter.encrypt(account.password);
		await this.#addAccountRepository.add(account);
	}
}