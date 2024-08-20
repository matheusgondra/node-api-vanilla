import { deepStrictEqual } from "assert";
import { describe, it, mock } from "node:test";
import { AddGuardianService } from "../../../src/data/use-cases/index.js";

describe("AddGuardianService", () => {
	it("Should call AddGuardianRepository with correct value", async () => {
		class AddGuardianRepository {
			async add(guardian) {
				return {
					id: "any_id",
					first_name: "any_first_name",
					last_name: "any_last_name",
					email: "any_email",
					createdAt: new Date("2024-01-01"),
					updatedAt: new Date("2024-01-01")
				};
			}
		}
		const addGuardianRepositoryStub = new AddGuardianRepository();
		const sut = new AddGuardianService({ addGuardianRepository: addGuardianRepositoryStub });
		mock.method(addGuardianRepositoryStub, "add");
		const params = {
			first_name: "any_first_name",
			last_name: "any_last_name",
			email: "any_email@mail.com",
			password: "any_password"
		};
		await sut.add(params);

		const calls = addGuardianRepositoryStub.add.mock.calls[0];
		deepStrictEqual(calls.arguments, [params]);
	});
});