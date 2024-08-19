export class SignupController {
	#validation;

	constructor({ validation }) {
		this.#validation = validation;
	}

	handle(httpRequest) {
		const error = this.#validation.validate(httpRequest.body);
		if (error) {
			return {
				statusCode: 400,
				body: error
			}
		}
	}
}