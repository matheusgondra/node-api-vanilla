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

const makeEncrypter = () => {
	class EncrypterStub {
		async encrypt(value) {
			return "hashed_password";
		}
	}

	return new EncrypterStub();
}

const makeSut = () => {
	const addAccountRepositoryStub = makeAddAccountRepository();
	const encrypterStub = makeEncrypter();
	const sut = new AddAccountService({
		addAccountRepository: addAccountRepositoryStub,
		encrypter: encrypterStub
	});

	return {
		sut,
		addAccountRepositoryStub,
		encrypterStub
	};
};

const makeFakeParams = () => ({
	first_name: "any_first_name",
	last_name: "any_last_name",
	email: "any_email@mail.com",
	password: "any_password"
});

describe("AddAccountService", () => {
	it("Should call AddAccountRepository with correct value", async () => {
		const { sut, addAccountRepositoryStub } = makeSut();
		mock.method(addAccountRepositoryStub, "add");
		const params = Object.assign({}, makeFakeParams(), { password: "hashed_password" });
		await sut.add(params);

		const calls = addAccountRepositoryStub.add.mock.calls[0];
		deepStrictEqual(calls.arguments, [params]);
	});

	it("Should throw if AddAccountRepository throws", async () => {
		const { sut, addAccountRepositoryStub } = makeSut();
		mock.method(addAccountRepositoryStub, "add").mock.mockImplementationOnce(() => {
			throw new Error();
		});

		await rejects(async () => await sut.add(makeFakeParams()), { name: "Error" });
	});

	it("Should call Encrypter with correct password", async () => {
		const { sut, encrypterStub } = makeSut();
		mock.method(encrypterStub, "encrypt");

		await sut.add(makeFakeParams());

		const calls = encrypterStub.encrypt.mock.calls[0];
		deepStrictEqual(calls.arguments, ["any_password"]);
	});

	it("Should throw if Encrypter throws", async () => {
		const { sut, encrypterStub } = makeSut();
		mock.method(encrypterStub, "encrypt").mock.mockImplementationOnce(() => {
			throw new Error();
		});

		await rejects(async () => await sut.add(makeFakeParams()), { name: "Error" });
	});

	it("Should return an account on success", async () => {
		const { sut } = makeSut();
		const account = await sut.add(makeFakeParams());

		deepStrictEqual(account, {
			id: "any_id",
			first_name: "any_first_name",
			last_name: "any_last_name",
			email: "any_email",
			createdAt: new Date("2024-01-01"),
			updatedAt: new Date("2024-01-01")
		});
	});
});