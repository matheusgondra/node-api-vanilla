import { Response } from "./response.js";

export class Success extends Response {
	constructor({ response, data }) {
		super({ response, statusCode: 200, data }).build();
	}
}