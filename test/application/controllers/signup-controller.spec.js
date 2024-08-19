import assert from "node:assert";
import { describe, it, mock } from "node:test";
import { SignupController } from "../../../src/application/controllers/index.js";

describe("SignupController", () => {
	it("Should call Validation with correct value", async () => {
		class ValidationStub {
			validate(input) {
				return null;
			}
		};
		const validatorStub = new ValidationStub();
		const sut = new SignupController({ validation: validatorStub });
		mock.method(validatorStub, "validate");
		const httpRequest = {
			body: {
				first_name: "any_first_name",
				last_name: "any_last_name",
				email: "any_email@mail.com",
				password: "any_password"
			}
		};
		sut.handle(httpRequest);

		const calls = validatorStub.validate.mock.calls[0];

		assert.deepEqual(calls.arguments, [httpRequest.body]);
	});
});