import { Success } from "../utils/http/index.js";

export class UserController {
	#userService;

	constructor({ userService }) {
		this.#userService = userService;
		this.#bindMethod();
	}

	async create(req, res) {
		try {
			const { name } = await this.#processRequestBody(req);
			const newUser = await this.#userService.create({ name });

			return new Success({ response: res, data: newUser });
		} catch (error) {
			console.error(error);
			return res.status(400).json({ error: "Invalid request body" });
		}
	}

	async list(req, res) {
		if (!this.#userService) {
			return console.log("User Service not found");
		}
		const users = await this.#userService?.list();

		return new Success({ response: res, data: users });
	}

	async teste(req, res) {
		return "bla"
	}

	async #bindMethod() {
		Object.getOwnPropertyNames(UserController.prototype)
			.filter((method) => typeof this[method] === 'function' && method !== 'constructor')
			.forEach((method) => {
				this[method] = this[method].bind(this);
			});
	}

	async #processRequestBody(req) {
		let body = "";

		for await (const chunk of req) {
			body += chunk.toString();
		}

		try {
			const parsedBody = JSON.parse(body);
			return parsedBody;
		} catch (error) {
			throw new Error("Invalid JSON");
		}
	}	
}
