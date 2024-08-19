import { Response } from "./response.js";

export class Success extends Response {
	constructor({ data }) {
		super({ statusCode: 200, data });
	}
}