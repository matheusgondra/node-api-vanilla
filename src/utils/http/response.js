export class Response {
	#response;
	#statusCode;
	#data;
	
	constructor({ response, statusCode, data }){
		this.#response = response;
		this.#statusCode = statusCode;
		this.#data = data;
	}

	build() {
		this.#response.writeHead(this.#statusCode, {
			'Content-Type': 'application/json'
		});

		this.#response.write(JSON.stringify(this.#data));
		this.#response.end();
	}
}