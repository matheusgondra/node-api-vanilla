import { deepStrictEqual, rejects } from "node:assert";
import { describe, it, mock } from "node:test";
import { AddAccountService } from "../../../src/data/use-cases/index.js";

const makeAddAccountRepository = () => {
	class AddAccountRepository {
		async add(account) {
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
	return new AddAccountRepository();
};

const makeSut = () => {
	const addAccountRepositoryStub = makeAddAccountRepository();
	const sut = new AddAccountService({ addAccountRepository: addAccountRepositoryStub });
	return {
		sut,
		addAccountRepositoryStub
	};
};

const makeFakeParams = () => ({
	first_name: "any_first_name",
	last_name: "any_last_name",
	email: "any_email@mail.com",
	password: "any_password"
});

describe("AddAccountService", () => {
	it("Should call AddAccountRepository with correct params", async () => {
		const { sut, addAccountRepositoryStub } = makeSut();
		mock.method(addAccountRepositoryStub, "add");
		await sut.add(makeFakeParams());

		const calls = addAccountRepositoryStub.add.mock.calls[0];
		deepStrictEqual(calls.arguments, [makeFakeParams()]);
	});

	it("Should throw if AddAccountRepository throws", async () => {
		const { sut, addAccountRepositoryStub } = makeSut();
		mock.method(addAccountRepositoryStub, "add").mock.mockImplementationOnce(() => {
			throw new Error();
		});

		await rejects(async () => await sut.add(makeFakeParams()), { name: "Error" });
	});
});