import { HttpResponse } from "../helpers/index.js";

export class SignupController {
	#validation;
	#addAccount;

	constructor({ validation, addAccount }) {
		this.#validation = validation;
		this.#addAccount = addAccount;
	}

	async handle(httpRequest) {
		try {
			const error = this.#validation.validate(httpRequest.body);
			if (error) {
				return HttpResponse.badRequest(error);
			}

			const account = await this.#addAccount.add(httpRequest.body);
			return HttpResponse.created(account);
		} catch (error) {
			return HttpResponse.serverError(error);
		}
	}
}