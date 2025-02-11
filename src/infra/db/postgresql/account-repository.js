import pg from "pg";

const { Client } = pg;

export class AccountRepository {
	#client;

	constructor() {
		this.#client = new Client();
	}

	async add(accountData) {
		await this.#client.connect();

		const query = `
			INSERT INTO users (first_name, last_name, email, password)
			VALUES ($1, $2, $3, $4)
		`;
		const values = [
			accountData.first_name,
			accountData.last_name,
			accountData.email,
			accountData.password
		];

		await this.#client.query(query, values);
		const { rows } = await this.#client.query("SELECT * FROM users WHERE email = $1", [accountData.email]);

		await this.#client.end();
		return rows[0];
	}
}