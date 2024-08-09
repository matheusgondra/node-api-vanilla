export class Router {
	#request;
	#response;
	#middlewares = [];

	constructor({ request, response }) {
		this.#request = request;
		this.#response = response;
	}

	use(...middleware) {
		this.#middlewares.push(...middleware);
	}

	async get(path, handler) {
		await this.match(path, "GET", handler);
	}

	async post(path, handler) {
		await this.match(path, "POST", handler);
	}

	async match(path, method, handler) {
		if (this.#request.url === path && this.#request.method === method) {
			if (this.#middlewares.length > 0)
				for await (const middleware of this.#middlewares) {
					await middleware(this.#request, this.#response);
				}

			await handler(this.#request, this.#response);
		}
	}
}