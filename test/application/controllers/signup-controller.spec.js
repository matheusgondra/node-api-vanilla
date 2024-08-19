import assert from "node:assert";
import { describe, it, mock } from "node:test";
import { SignupController } from "../../../src/application/controllers/index.js";
import { HttpResponse } from "../../../src/application/helpers/index.js";

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
	const sut = new SignupController({ validation: validatorStub });
	return { sut, validatorStub };
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

		sut.handle(makeFakeRequest());
		const calls = validatorStub.validate.mock.calls[0];

		assert.deepEqual(calls.arguments, [makeFakeRequest().body]);
	});

	it("Should return an 400 if Validation fails", () => {
		const { sut, validatorStub } = makeSut();
		mock.method(validatorStub, "validate").mock.mockImplementationOnce(() => new Error());

		const httpResponse = sut.handle(makeFakeRequest());

		assert.deepStrictEqual(httpResponse, HttpResponse.badRequest(new Error()));
	});
});