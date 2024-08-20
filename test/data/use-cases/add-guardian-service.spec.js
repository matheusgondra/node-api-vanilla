import { deepStrictEqual } from "assert";
import { describe, it, mock } from "node:test";
import { AddGuardianService } from "../../../src/data/use-cases/index.js";

const makeAddGuardianRepository = () => {
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
	return new AddGuardianRepository();
};

const makeSut = () => {
	const addGuardianRepositoryStub = makeAddGuardianRepository();
	const sut = new AddGuardianService({ addGuardianRepository: addGuardianRepositoryStub });
	return {
		sut,
		addGuardianRepositoryStub
	};
};

const makeFakeParams = () => ({
	first_name: "any_first_name",
	last_name: "any_last_name",
	email: "any_email@mail.com",
	password: "any_password"
});

describe("AddGuardianService", () => {
	it("should call AddGuardianRepository with correct params", async () => {
		const { sut, addGuardianRepositoryStub } = makeSut();
		mock.method(addGuardianRepositoryStub, "add");
		await sut.add(makeFakeParams());

		const calls = addGuardianRepositoryStub.add.mock.calls[0];
		deepStrictEqual(calls.arguments, [makeFakeParams()]);
	});
});