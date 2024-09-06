export class AddAccountService {
	#addAccountRepository;
	#encrypter;

	constructor({ addAccountRepository, encrypter }) {
		this.#addAccountRepository = addAccountRepository;
		this.#encrypter = encrypter;
	}

	async add(accountData) {
		const hashedPassword = await this.#encrypter.encrypt(accountData.password);
		const account = await this.#addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }));
		return account;
	}
}