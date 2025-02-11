import { deepStrictEqual, ok, strictEqual } from "node:assert";
import { beforeEach, describe, it } from "node:test";
import pg from "pg";
import { AccountRepository } from "../../../../src/infra/db/postgresql/account-repository.js";

const makeSut = () => {
	return new AccountRepository();
}

describe("AccountRepository", () => {
	describe("add", () => {
		beforeEach(async () => {
			const client = new pg.Client();
			await client.connect();
			await client.query("DELETE FROM users");
			await client.end();
		});

		it("Should return an account on success", async () => {
			const sut = makeSut();
			const account = await sut.add({
				first_name: "any_first_name",
				last_name: "any_last_name",
				email: "any_email@mail.com",
				password: "any_password"
			});

			deepStrictEqual({
				first_name: account.first_name,
				last_name: account.last_name,
				email: account.email
			},
				{
					first_name: "any_first_name",
					last_name: "any_last_name",
					email: "any_email@mail.com"
				});

			ok(account.id);
			ok(account.created_at);
			ok(account.updated_at);
			strictEqual(typeof account.id, "number");
			strictEqual(typeof account.created_at, typeof new Date());
			strictEqual(typeof account.updated_at, typeof new Date());
		});
	});
});