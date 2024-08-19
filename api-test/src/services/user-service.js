export class UserService {
	#userRepository;

	constructor({ userRepository }) {
		this.#userRepository = userRepository;
	}

	async list() {
		return await this.#userRepository.list();
	}

	async create({ name }) {
		return await this.#userRepository.insert({ name });
	}
}