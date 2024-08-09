export class Response {
	#statusCode;
	#data;

	constructor({ statusCode, data }) {
		this.#statusCode = statusCode;
		this.#data = data;
	}

	build(response) {
		response.writeHead(this.#statusCode, {
			'Content-Type': 'application/json'
		});

		response.write(JSON.stringify(this.#data));
		response.end();
	}
}