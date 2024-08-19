export class SignupController {
	#validation;

	constructor({ validation }) {
		this.#validation = validation;
	}

	handle(httpRequest) {
		this.#validation.validate(httpRequest.body);
	}
}