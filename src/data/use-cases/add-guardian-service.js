export class AddGuardianService {
	#addGuardianRepository;

	constructor({ addGuardianRepository }) {
		this.#addGuardianRepository = addGuardianRepository;
	}

	async add(guardian) {
		await this.#addGuardianRepository.add(guardian);
	}
}