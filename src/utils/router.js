export class Router {
	#request;
	#response;

	constructor({ request, response }) {
		this.#request = request;
		this.#response = response;
	}

	async get(path, handler) {
		if (this.#request.url === path && this.#request.method === 'GET') {
			await handler(this.#request, this.#response);
		}
	}

	async post(path, handler) {
		if (this.#request.url === path && this.#request.method === 'POST') {
			await handler(this.#request, this.#response);
		}
	}
}