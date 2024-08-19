import { Success } from "../utils/http/index.js";

export class UserController {
	#userService;

	constructor({ userService }) {
		this.#userService = userService;
		this.#bindMethod();
	}

	async handle(httpRequest) {
		try {
			const { name } = httpRequest.body;
			const newUser = await this.#userService.create({ name });

			return new Success({ data: newUser });
		} catch (error) {
			console.error(error);
			throw new Error("Internal Server Error");
		}
	}

	// async list(req, res) {
	// 	if (!this.#userService) {
	// 		return console.log("User Service not found");
	// 	}
	// 	const users = await this.#userService?.list();

	// 	return new Success({ response: res, data: users });
	// }

	// async teste(req, res) {
	// 	return "bla"
	// }

	async #bindMethod() {
		Object.getOwnPropertyNames(UserController.prototype)
			.filter((method) => typeof this[method] === 'function' && method !== 'constructor')
			.forEach((method) => {
				this[method] = this[method].bind(this);
			});
	}
}
