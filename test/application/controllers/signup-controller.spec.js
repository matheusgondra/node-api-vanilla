import assert from "node:assert";
import { describe, it, mock } from "node:test";
import { SignupController } from "../../../src/application/controllers/index.js";
import { HttpResponse } from "../../../src/application/helpers/index.js";

const makeAddAccountStub = () => {
	class AddAccountStub {
		async add(account) {
			return {
				id: "any_id",
				first_name: "any_first_name",
				last_name: "any_last_name",
				email: "any_email@mail.com",
				createdAt: new Date("2024-01-01"),
				updatedAt: new Date("2024-01-01")
			};
		}
	}
	return new AddAccountStub();
};

const makeValidationStub = () => {
	class ValidationStub {
		validate(input) {
			return null;
		}
	};
	return new ValidationStub();
}

const makeSut = () => {
	const validatorStub = makeValidationStub();
	const addAccountStub = makeAddAccountStub();
	const sut = new SignupController({ validation: validatorStub, addAccount: addAccountStub });
	return {
		sut,
		validatorStub,
		addAccountStub
	};
};

const makeFakeRequest = () => ({
	body: {
		first_name: "any_first_name",
		last_name: "any_last_name",
		email: "any_email@mail.com",
		password: "any_password"
	}
});

describe("SignupController", () => {
	it("Should call Validation with correct value", async () => {
		const { sut, validatorStub } = makeSut();
		mock.method(validatorStub, "validate");

		await sut.handle(makeFakeRequest());
		const calls = validatorStub.validate.mock.calls[0];

		assert.deepStrictEqual(calls.arguments, [makeFakeRequest().body]);
	});

	it("Should return an 400 if Validation fails", async () => {
		const { sut, validatorStub } = makeSut();
		mock.method(validatorStub, "validate").mock.mockImplementationOnce(() => new Error());

		const httpResponse = await sut.handle(makeFakeRequest());

		assert.deepStrictEqual(httpResponse, HttpResponse.badRequest(new Error()));
	});

	it("Should call AddAccount with correct value", async () => {
		const { sut, addAccountStub } = makeSut();
		mock.method(addAccountStub, "add");

		await sut.handle(makeFakeRequest());

		const calls = addAccountStub.add.mock.calls[0];

		assert.deepStrictEqual(calls.arguments, [makeFakeRequest().body]);
	});

	it("Should return 500 if AddAccount throws", async () => {
		const { sut, addAccountStub } = makeSut();
		mock.method(addAccountStub, "add").mock.mockImplementationOnce(() => {
			throw new Error()
		});

		const httpResponse = await sut.handle(makeFakeRequest());

		assert.deepStrictEqual(httpResponse, HttpResponse.serverError(new Error()));
	});

	it("Should return 201 on success", async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.handle(makeFakeRequest());

		assert.deepStrictEqual(httpResponse, HttpResponse.created({
			id: "any_id",
			first_name: "any_first_name",
			last_name: "any_last_name",
			email: "any_email@mail.com",
			createdAt: new Date("2024-01-01"),
			updatedAt: new Date("2024-01-01")
		}));
	});
});